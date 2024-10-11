import { GetStoreByUserIdService } from "./get-store-by-user-id.service";
import { InMemoryStoreRepository } from "../../repository/in-memory-repository/in-memory-store-repository";
import { ThereIsNoStoreRegisteredWithThisUserIdError } from "../error/there-is-no-store-registered-with-this-user-id-error";

describe("GetStoreByUserIdService", () => {
  let storeRepository: InMemoryStoreRepository;
  let getStoreByUserIdService: GetStoreByUserIdService;

  // Configurando o repositório e o serviço antes de cada teste
  beforeEach(() => {
    storeRepository = new InMemoryStoreRepository();
    getStoreByUserIdService = new GetStoreByUserIdService(storeRepository);
  });

  it("should return a store by userId if it exists", async () => {
    // Registrando uma loja no repositório in-memory
    const store = await storeRepository.register(
      "Loja Teste",
      "Descrição da loja",
      "12345678901234",
      "user123",
      "http://example.com/store.jpg"
    );

    // Executando o serviço para buscar a loja pelo userId
    const response = await getStoreByUserIdService.execute({ userId: store.userId });

    // Verificando se a loja foi encontrada corretamente
    expect(response.store).toEqual(store);
    expect(response.error).toBeNull();
  });

  it("should return an error if store is not found by userId", async () => {
    // Tentando buscar uma loja com um userId inexistente
    const response = await getStoreByUserIdService.execute({ userId: "non-existing-user-id" });

    // Verificando se o erro foi retornado corretamente
    expect(response.store).toBeNull();
    expect(response.error).toBeInstanceOf(ThereIsNoStoreRegisteredWithThisUserIdError);
  });
});
