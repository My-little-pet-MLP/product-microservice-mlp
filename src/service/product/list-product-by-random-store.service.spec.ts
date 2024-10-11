import { ListAllProductByStoreRandomService } from "./list-product-by-random-store.service";
import { InMemoryProductRepository } from "../../repository/in-memory-repository/in-memory-product-repository";
import { InMemoryStoreRepository } from "../../repository/in-memory-repository/in-memory-store-repository";
import { StoreNotFoundError } from "../error/store-not-found-error";

describe("ListAllProductByStoreRandomService", () => {
  let productRepository: InMemoryProductRepository;
  let storeRepository: InMemoryStoreRepository;
  let listAllProductByStoreRandomService: ListAllProductByStoreRandomService;

  // Configurando o repositório e o serviço antes de cada teste
  beforeEach(() => {
    productRepository = new InMemoryProductRepository();
    storeRepository = new InMemoryStoreRepository();
    listAllProductByStoreRandomService = new ListAllProductByStoreRandomService(productRepository, storeRepository);
  });

  it("should return products from a random store with correct pagination", async () => {
    // Registrando uma loja no repositório in-memory
    const storeCreated = await storeRepository.register(
      "Loja Teste",
      "Descrição da loja",
      "12345678901234",
      "user123",
      "http://example.com/store.jpg"
    );

    // Registrando alguns produtos na loja
    for (let i = 1; i <= 10; i++) {
      await productRepository.register({
        title: `Produto ${i}`,
        slug: `produto-${i}`,
        imageUrl: `http://example.com/product-${i}.jpg`,
        description: `Descrição do produto ${i}`,
        priceInCents: 1000 * i,
        stock: 10 + i,
        categoryId: "category123",
        storeId: storeCreated.id,
        isActive: true,
      });
    }

    // Simulando a busca por uma loja aleatória
    jest.spyOn(storeRepository, "getRandomStore").mockResolvedValue(storeCreated);

    // Executando o serviço com paginação (page: 1, size: 5)
    const response = await listAllProductByStoreRandomService.execute({ page: 1, size: 5 });

    // Verificando a resposta
    expect(response.store).toEqual(storeCreated);
    expect(response.products.length).toBe(5); // Deve retornar 5 produtos na primeira página
    expect(response.totalPages).toBe(2); // 10 produtos no total com 5 por página
    expect(response.error).toBeNull();
  });

  it("should return an error if no store is found", async () => {
    // Simulando a falha na busca de uma loja aleatória
    jest.spyOn(storeRepository, "getRandomStore").mockResolvedValue(null);

    // Executando o serviço
    await expect(listAllProductByStoreRandomService.execute({ page: 1, size: 5 }))
      .rejects
      .toThrow(StoreNotFoundError); // Deve lançar o erro StoreNotFoundError
  });

  it("should throw an error if page or size is invalid", async () => {
    // Tentando executar o serviço com valores inválidos para `page` e `size`
    await expect(listAllProductByStoreRandomService.execute({ page: 0, size: 5 }))
      .rejects
      .toThrow("Page and size must be positive numbers.");

    await expect(listAllProductByStoreRandomService.execute({ page: 1, size: 0 }))
      .rejects
      .toThrow("Page and size must be positive numbers.");
  });
});
