import { ListProductByCategoryService } from "./list-product-by-category.service";
import { InMemoryProductRepository } from "../../repository/in-memory-repository/in-memory-product-repository";
import { InMemoryCategoryRepository } from "../../repository/in-memory-repository/in-memory-category-repository";
import { CategoryNotFoundError } from "../error/category-not-found-error";

describe("ListProductByCategoryService", () => {
  let productRepository: InMemoryProductRepository;
  let categoryRepository: InMemoryCategoryRepository;
  let listProductByCategoryService: ListProductByCategoryService;

  // Configurando o repositório e o serviço antes de cada teste
  beforeEach(() => {
    productRepository = new InMemoryProductRepository();
    categoryRepository = new InMemoryCategoryRepository();
    listProductByCategoryService = new ListProductByCategoryService(productRepository, categoryRepository);
  });

  it("should return products from a category with correct pagination", async () => {
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

    // Executando o serviço com paginação (page: 1, size: 5)
    const response = await listProductByCategoryService.execute({ categoryId: categoryCreated.id, page: 1, size: 5 });

    // Verificando a resposta
    expect(response.products?.length).toBe(5); // Deve retornar 5 produtos na primeira página
    expect(response.totalPages).toBe(2); // 10 produtos no total com 5 por página
    expect(response.error).toBeNull();
  });

  it("should return an error if category does not exist", async () => {
    // Tentando buscar produtos de uma categoria inexistente
    const response = await listProductByCategoryService.execute({ categoryId: "non-existing-category", page: 1, size: 5 });

    // Verifica se o erro de categoria não encontrada foi retornado
    expect(response.products).toBeNull();
    expect(response.totalPages).toBeNull();
    expect(response.error).toBeInstanceOf(CategoryNotFoundError);
  });

  it("should return empty products if category exists but no products are found", async () => {
    // Registrando uma categoria sem produtos
    const categoryCreated = await categoryRepository.register({
      title: "Categoria Vazia",
      slug: "categoria-vazia",
    });

    // Executando o serviço
    const response = await listProductByCategoryService.execute({ categoryId: categoryCreated.id, page: 1, size: 5 });

    // Verificando a resposta
    expect(response.products?.length).toBe(0); // Deve retornar uma lista vazia
    expect(response.totalPages).toBe(0); // Deve retornar 0 páginas
    expect(response.error).toBeNull();
  });
});
