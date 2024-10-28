import { InMemoryPetRepository } from "../../repository/in-memory-repository/in-memory-pet-repository"; // Repositório in-memory criado anteriormente
import { GetPetByIdService } from "../pet/get-pet-by-id.service";
import { PetNotFoundError } from "../error/pet-not-found-error";

describe("GetPetByIdService", () => {
  let petRepository: InMemoryPetRepository;
  let getPetByIdService: GetPetByIdService;

  beforeEach(() => {
    petRepository = new InMemoryPetRepository();
    getPetByIdService = new GetPetByIdService(petRepository);
  });

  it("deve retornar o pet quando encontrado", async () => {
    // Adicionando um pet manualmente para teste
    const pet = await petRepository.register({
      id: "pet-123",
      name: "Rex",
      breed: "Labrador",
      age: 3,
      imageUrl: "http://example.com/rex.jpg",
      size: "grande",
      customerId: "customer-123",
    });

    const response = await getPetByIdService.execute({ id: "pet-123" });

    expect(response.pet).toEqual(pet);
    expect(response.error).toBeNull();
  });

  it("deve retornar erro PetNotFoundError quando o pet não é encontrado", async () => {
    const response = await getPetByIdService.execute({ id: "pet-999" });

    expect(response.pet).toBeNull();
    expect(response.error).toBeInstanceOf(PetNotFoundError);
  });
});
