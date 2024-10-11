import { GetStoreByIdService } from "./get-store-by-id.service";
import { InMemoryStoreRepository } from "../../repository/in-memory-repository/in-memory-store-repository";
import { StoreNotFoundError } from "../error/store-not-found-error";

describe("GetStoreByIdService", () => {
  let storeRepository: InMemoryStoreRepository;
  let getStoreByIdService: GetStoreByIdService;

  // Configurando o repositório e o serviço antes de cada teste
  beforeEach(() => {
    storeRepository = new InMemoryStoreRepository();
    getStoreByIdService = new GetStoreByIdService(storeRepository);
  });

  it("should return a store by id if it exists", async () => {
    // Registrando uma loja no repositório in-memory
    const store = await storeRepository.register(
      "Loja Teste",
      "Descrição da loja",
      "12345678901234",
      "user123",
      "http://example.com/store.jpg"
    );

    // Executando o serviço para buscar a loja pelo ID
    const response = await getStoreByIdService.execute({ id: store.id });

    // Verificando se a loja foi encontrada corretamente
    expect(response.store).toEqual(store);
    expect(response.error).toBeNull();
  });

  it("should return an error if store does not exist", async () => {
    // Tentando buscar uma loja que não existe
    const response = await getStoreByIdService.execute({ id: "non-existing-id" });

    // Verificando se o erro de loja não encontrada foi retornado
    expect(response.store).toBeNull();
    expect(response.error).toBeInstanceOf(StoreNotFoundError);
  });
});
