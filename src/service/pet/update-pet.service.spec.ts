import { InMemoryPetRepository } from "../../repository/in-memory-repository/in-memory-pet-repository";
import { UpdatePetService } from "../pet/update-pet.service";
import { PetNotFoundError } from "../error/pet-not-found-error";
import { PetDontLiveMoreItError } from "../error/pet-dont-live-more-error";
import { PetsBreedMustHaveCharacteresError } from "../error/pets-breed-must-have-characteres-error";
import { NameIsMustLongError } from "../error/name-is-must-long-error";

describe("UpdatePetService", () => {
  let petRepository: InMemoryPetRepository;
  let updatePetService: UpdatePetService;

  beforeEach(() => {
    petRepository = new InMemoryPetRepository();
    updatePetService = new UpdatePetService(petRepository);
  });

  it("should successfully update a pet", async () => {
    const pet = await petRepository.register({
      id: "pet-123",
      name: "Rex",
      breed: "Labrador",
      age: 5,
      imageUrl: "http://example.com/rex.jpg",
      size: "grande",
      customerId: "customer-123",
    });

    const response = await updatePetService.execute({
      id: pet.id,
      name: "Max",
      breed: "Golden Retriever",
      age: 6,
      imageUrl: "http://example.com/max.jpg",
      size: "medio",
    });

    expect(response.pet).not.toBeNull();
    expect(response.error).toBeNull();
    expect(response.pet?.name).toBe("Max");
  });

  it("should return an error if the pet is not found", async () => {
    const response = await updatePetService.execute({
      id: "nonexistent",
      name: "Rex",
      breed: "Labrador",
      age: 5,
      imageUrl: "http://example.com/rex.jpg",
      size: "grande",
    });

    expect(response.pet).toBeNull();
    expect(response.error).toBeInstanceOf(PetNotFoundError);
  });

  it("should return an error if the pet's age is invalid", async () => {
    const pet = await petRepository.register({
      id: "pet-123",
      name: "Rex",
      breed: "Labrador",
      age: 5,
      imageUrl: "http://example.com/rex.jpg",
      size: "grande",
      customerId: "customer-123",
    });

    const response = await updatePetService.execute({
      id: pet.id,
      name: "Rex",
      breed: "Labrador",
      age: 35, // Invalid age
      imageUrl: "http://example.com/rex.jpg",
      size: "grande",
    });

    expect(response.pet).toBeNull();
    expect(response.error).toBeInstanceOf(PetDontLiveMoreItError);
  });

  it("should return an error if the pet's breed has more than 80 characters", async () => {
    const pet = await petRepository.register({
      id: "pet-123",
      name: "Rex",
      breed: "Labrador",
      age: 5,
      imageUrl: "http://example.com/rex.jpg",
      size: "grande",
      customerId: "customer-123",
    });

    const response = await updatePetService.execute({
      id: pet.id,
      name: "Rex",
      breed: "L" + "o".repeat(80), // Breed with more than 80 characters
      age: 5,
      imageUrl: "http://example.com/rex.jpg",
      size: "grande",
    });

    expect(response.pet).toBeNull();
    expect(response.error).toBeInstanceOf(PetsBreedMustHaveCharacteresError);
  });

  it("should return an error if the pet's name has more than 80 characters", async () => {
    const pet = await petRepository.register({
      id: "pet-123",
      name: "Rex",
      breed: "Labrador",
      age: 5,
      imageUrl: "http://example.com/rex.jpg",
      size: "grande",
      customerId: "customer-123",
    });

    const response = await updatePetService.execute({
      id: pet.id,
      name: "N".repeat(81), // Name with more than 80 characters
      breed: "Labrador",
      age: 5,
      imageUrl: "http://example.com/rex.jpg",
      size: "grande",
    });

    expect(response.pet).toBeNull();
    expect(response.error).toBeInstanceOf(NameIsMustLongError);
  });
});
