import { ListAllProductByCategoryRandomService } from "./list-product-by-category-random.service";
import { InMemoryProductRepository } from "../../repository/in-memory-repository/in-memory-product-repository";
import { InMemoryCategoryRepository } from "../../repository/in-memory-repository/in-memory-category-repository";
import { CategoryNotFoundError } from "../error/category-not-found-error";

describe("ListAllProductByCategoryRandomService", () => {
  let productRepository: InMemoryProductRepository;
  let categoryRepository: InMemoryCategoryRepository;
  let listAllProductByCategoryRandomService: ListAllProductByCategoryRandomService;

  // Configurando o repositório e o serviço antes de cada teste
  beforeEach(() => {
    productRepository = new InMemoryProductRepository();
    categoryRepository = new InMemoryCategoryRepository();
    listAllProductByCategoryRandomService = new ListAllProductByCategoryRandomService(productRepository, categoryRepository);
  });

  it("should return products from a random category with correct pagination", async () => {
    // Registrando uma categoria no repositório in-memory
    const categoryCreated = await categoryRepository.register({
      title: "Categoria Teste",
      slug: "categoria-teste",
    });

    // Registrando alguns produtos na categoria
    for (let i = 1; i <= 10; i++) {
      await productRepository.register({
        title: `Produto ${i}`,
        slug: `produto-${i}`,
        imageUrl: `http://example.com/product-${i}.jpg`,
        description: `Descrição do produto ${i}`,
        priceInCents: 1000 * i,
        stock: 10 + i,
        categoryId: categoryCreated.id,
        storeId: "store123",
        isActive: true,
      });
    }

    // Simulando a busca por uma categoria aleatória
    jest.spyOn(categoryRepository, "SortRandomCategory").mockResolvedValue(categoryCreated);

    // Executando o serviço com paginação (page: 1, size: 5)
    const response = await listAllProductByCategoryRandomService.execute({ page: 1, size: 5 });

    // Verificando a resposta
    expect(response.category).toEqual(categoryCreated);
    expect(response.products.length).toBe(5); // Deve retornar 5 produtos na primeira página
    expect(response.totalPages).toBe(2); // 10 produtos no total com 5 por página
    expect(response.error).toBeNull();
  });

  it("should return an error if no category is found", async () => {
    // Simulando a falha na busca de uma categoria aleatória
    jest.spyOn(categoryRepository, "SortRandomCategory").mockResolvedValue(null);

    // Executando o serviço
    await expect(listAllProductByCategoryRandomService.execute({ page: 1, size: 5 }))
      .rejects
      .toThrow(CategoryNotFoundError); // Deve lançar o erro CategoryNotFoundError
  });

  it("should throw an error if page or size is invalid", async () => {
    // Tentando executar o serviço com valores inválidos para `page` e `size`
    await expect(listAllProductByCategoryRandomService.execute({ page: 0, size: 5 }))
      .rejects
      .toThrow("Page and size must be positive numbers.");

    await expect(listAllProductByCategoryRandomService.execute({ page: 1, size: 0 }))
      .rejects
      .toThrow("Page and size must be positive numbers.");
  });
});
