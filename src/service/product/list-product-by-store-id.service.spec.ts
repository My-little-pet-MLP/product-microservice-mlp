import { ListProductByStoreIdService } from "./list-product-by-store-id.service";
import { InMemoryProductRepository } from "../../repository/in-memory-repository/in-memory-product-repository";
import { InMemoryStoreRepository } from "../../repository/in-memory-repository/in-memory-store-repository";
import { StoreNotFoundError } from "../error/store-not-found-error";

describe("ListProductByStoreIdService", () => {
  let productRepository: InMemoryProductRepository;
  let storeRepository: InMemoryStoreRepository;
  let listProductByStoreIdService: ListProductByStoreIdService;

  // Configurando o repositório e o serviço antes de cada teste
  beforeEach(() => {
    productRepository = new InMemoryProductRepository();
    storeRepository = new InMemoryStoreRepository();
    listProductByStoreIdService = new ListProductByStoreIdService(productRepository, storeRepository);
  });

  it("should return products from a store with correct pagination", async () => {
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

    // Executando o serviço com paginação (page: 1, size: 5)
    const response = await listProductByStoreIdService.execute({ storeId: storeCreated.id, page: 1, size: 5 });

    // Verificando a resposta
    expect(response.products?.length).toBe(5); // Deve retornar 5 produtos na primeira página
    expect(response.totalPages).toBe(2); // 10 produtos no total com 5 por página
    expect(response.error).toBeNull();
  });

  it("should return an error if store does not exist", async () => {
    // Tentando buscar produtos de uma loja inexistente
    const response = await listProductByStoreIdService.execute({ storeId: "non-existing-store", page: 1, size: 5 });

    // Verifica se o erro de loja não encontrada foi retornado
    expect(response.products).toBeNull();
    expect(response.totalPages).toBeNull();
    expect(response.error).toBeInstanceOf(StoreNotFoundError);
  });

  it("should return empty products if store exists but no products are found", async () => {
    // Registrando uma loja sem produtos
    const storeCreated = await storeRepository.register(
      "Loja Vazia",
      "Descrição da loja",
      "98765432101234",
      "user456",
      "http://example.com/store-empty.jpg"
    );

    // Executando o serviço
    const response = await listProductByStoreIdService.execute({ storeId: storeCreated.id, page: 1, size: 5 });

    // Verificando a resposta
    expect(response.products?.length).toBe(0); // Deve retornar uma lista vazia
    expect(response.totalPages).toBe(0); // Deve retornar 0 páginas
    expect(response.error).toBeNull();
  });
});
