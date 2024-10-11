import { ReactivateStoreByIdService } from "./reactivate-store-by-id.service";
import { InMemoryStoreRepository } from "../../repository/in-memory-repository/in-memory-store-repository";
import { StoreNotFoundError } from "../error/store-not-found-error";

describe("ReactivateStoreByIdService", () => {
  let storeRepository: InMemoryStoreRepository;
  let reactivateStoreByIdService: ReactivateStoreByIdService;

  // Configurando o repositório e o serviço antes de cada teste
  beforeEach(() => {
    storeRepository = new InMemoryStoreRepository();
    reactivateStoreByIdService = new ReactivateStoreByIdService(storeRepository);
  });

  it("should reactivate a store by id if it exists", async () => {
    // Registrando uma loja no repositório in-memory
    const store = await storeRepository.register(
      "Loja Teste",
      "Descrição da loja",
      "12345678901234",
      "user123",
      "http://example.com/store.jpg"
    );

    // Desativando a loja
    await storeRepository.delete(store.id);

    // Reativando a loja
    const response = await reactivateStoreByIdService.execute({ id: store.id });

    // Verificando se a loja foi reativada corretamente
    expect(response.store?.isActive).toBe(true); // A loja deve estar reativada
    expect(response.error).toBeNull();
  });

  it("should return an error if store does not exist", async () => {
    // Simulando erro ao tentar reativar uma loja inexistente
    const response = await reactivateStoreByIdService.execute({ id: "non-existing-id" });

    // Verificando se retornou erro de loja não encontrada
    expect(response.store).toBeNull();
    expect(response.error).toBeInstanceOf(StoreNotFoundError);
  });
});
