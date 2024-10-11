import { UpdateStoreService } from "./update-store.service";
import { InMemoryStoreRepository } from "../../repository/in-memory-repository/in-memory-store-repository";
import { StoreNotFoundError } from "../error/store-not-found-error";

describe("UpdateStoreService", () => {
  let storeRepository: InMemoryStoreRepository;
  let updateStoreService: UpdateStoreService;

  // Configurando o repositório e o serviço antes de cada teste
  beforeEach(() => {
    storeRepository = new InMemoryStoreRepository();
    updateStoreService = new UpdateStoreService(storeRepository);
  });

  it("should update a store successfully if it exists", async () => {
    // Registrando uma loja no repositório in-memory
    const store = await storeRepository.register(
      "Loja Teste",
      "Descrição da loja",
      "12345678901234",
      "user123",
      "http://example.com/store.jpg"
    );

    // Atualizando a loja
    const response = await updateStoreService.execute({
      id: store.id,
      title: "Loja Atualizada",
      description: "Descrição atualizada",
      cnpj: "12345678901234",
      imageUrl: "http://example.com/store-updated.jpg"
    });

    // Verificando se a loja foi atualizada corretamente
    expect(response.store).toBeTruthy();
    expect(response.store?.title).toBe("Loja Atualizada");
    expect(response.store?.description).toBe("Descrição atualizada");
    expect(response.store?.imageUrl).toBe("http://example.com/store-updated.jpg");
    expect(response.error).toBeNull();
  });

  it("should return an error if store does not exist", async () => {
    // Tentando atualizar uma loja inexistente
    const response = await updateStoreService.execute({
      id: "non-existing-store-id",
      title: "Loja Inexistente",
      description: "Descrição inexistente",
      cnpj: "00000000000000",
      imageUrl: "http://example.com/non-existing.jpg"
    });

    // Verificando se o erro de loja não encontrada foi retornado
    expect(response.store).toBeNull();
    expect(response.error).toBeInstanceOf(StoreNotFoundError);
  });
});
