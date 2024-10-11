import { DeleteStoreByIdService } from "./delete-store-by-id.service";
import { InMemoryStoreRepository } from "../../repository/in-memory-repository/in-memory-store-repository";

describe("DeleteStoreByIdService", () => {
  let storeRepository: InMemoryStoreRepository;
  let deleteStoreByIdService: DeleteStoreByIdService;

  // Configurando o repositório e o serviço antes de cada teste
  beforeEach(() => {
    storeRepository = new InMemoryStoreRepository();
    deleteStoreByIdService = new DeleteStoreByIdService(storeRepository);
  });

  it("should delete (deactivate) a store by id", async () => {
    // Registrando uma loja no repositório in-memory
    const store = await storeRepository.register(
      "Loja Teste",
      "Descrição da loja",
      "12345678901234",
      "user123",
      "http://example.com/store.jpg"
    );

    // Deletando a loja
    await deleteStoreByIdService.execute({ id: store.id });

    // Verificando se a loja foi desativada
    const storeAfterDelete = await storeRepository.findById(store.id);
    expect(storeAfterDelete?.isActive).toBe(false); // A loja deve estar desativada
  });

  it("should handle non-existing store deletion gracefully", async () => {
    // Tentando deletar uma loja que não existe
    await expect(deleteStoreByIdService.execute({ id: "non-existing-id" }))
      .resolves.toEqual({}); // Deve retornar um objeto vazio sem erros
  });
});
