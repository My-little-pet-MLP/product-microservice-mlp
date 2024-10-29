import { InMemoryPetRepository } from "../../repository/in-memory-repository/in-memory-pet-repository";
import { RegisterPetService } from "../pet/register-pet.service";
import { clearkClientCustomer } from "../../lib/cleark";
import { CustomerNotFoundError } from "../error/customer-not-found-error";
import { ErrorFetchingCustomerError } from "../error/error-fetchig-customer-error";
import { PetDontLiveMoreItError } from "../error/pet-dont-live-more-error";
import { PetsBreedMustHaveCharacteresError } from "../error/pets-breed-must-have-characteres-error";

jest.mock("../../lib/cleark");

describe("RegisterPetService", () => {
  let petRepository: InMemoryPetRepository;
  let registerPetService: RegisterPetService;

  beforeEach(() => {
    petRepository = new InMemoryPetRepository();
    registerPetService = new RegisterPetService(petRepository);
  });

  it("deve registrar um pet com sucesso", async () => {
    (clearkClientCustomer.users.getUser as jest.Mock).mockResolvedValue(true);

    const response = await registerPetService.execute({
      customerId: "customer-123",
      name: "Rex",
      breed: "Labrador",
      age: 5,
      imageUrl: "http://example.com/rex.jpg",
      size: "grande",
    });

    expect(response.pet).not.toBeNull();
    expect(response.error).toBeNull();
  });

  it("deve retornar erro se o cliente não for encontrado", async () => {
    (clearkClientCustomer.users.getUser as jest.Mock).mockResolvedValue(null);

    const response = await registerPetService.execute({
      customerId: "inexistente",
      name: "Rex",
      breed: "Labrador",
      age: 5,
      imageUrl: "http://example.com/rex.jpg",
      size: "grande",
    });

    expect(response.pet).toBeNull();
    expect(response.error).toBeInstanceOf(CustomerNotFoundError);
  });

  it("deve retornar erro ao buscar o cliente", async () => {
    (clearkClientCustomer.users.getUser as jest.Mock).mockRejectedValue(new Error());

    const response = await registerPetService.execute({
      customerId: "customer-123",
      name: "Rex",
      breed: "Labrador",
      age: 5,
      imageUrl: "http://example.com/rex.jpg",
      size: "grande",
    });

    expect(response.pet).toBeNull();
    expect(response.error).toBeInstanceOf(ErrorFetchingCustomerError);
  });

  it("deve retornar erro se a idade do pet for inválida", async () => {
    (clearkClientCustomer.users.getUser as jest.Mock).mockResolvedValue(true);

    const response = await registerPetService.execute({
      customerId: "customer-123",
      name: "Rex",
      breed: "Labrador",
      age: 35, // Idade inválida
      imageUrl: "http://example.com/rex.jpg",
      size: "grande",
    });

    expect(response.pet).toBeNull();
    expect(response.error).toBeInstanceOf(PetDontLiveMoreItError);
  });

  it("deve retornar erro se a raça do pet tiver mais de 80 caracteres", async () => {
    (clearkClientCustomer.users.getUser as jest.Mock).mockResolvedValue(true);

    const response = await registerPetService.execute({
      customerId: "customer-123",
      name: "Rex",
      breed: "L" + "o".repeat(80), // Raça com mais de 80 caracteres
      age: 5,
      imageUrl: "http://example.com/rex.jpg",
      size: "grande",
    });

    expect(response.pet).toBeNull();
    expect(response.error).toBeInstanceOf(PetsBreedMustHaveCharacteresError);
  });
});
