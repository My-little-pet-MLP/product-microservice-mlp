import { GetProductByIdService } from "./get-product-by-id.service";
import { InMemoryProductRepository } from "../../repository/in-memory-repository/in-memory-product-repository";
import { InMemoryCategoryRepository } from "../../repository/in-memory-repository/in-memory-category-repository";
import { InMemoryStoreRepository } from "../../repository/in-memory-repository/in-memory-store-repository";
import { ProductNotFoundError } from "../error/product-not-found-error";
import { CategoryNotFoundError } from "../error/category-not-found-error";
import { StoreNotFoundError } from "../error/store-not-found-error";

describe("GetProductByIdService", () => {
  let productRepository: InMemoryProductRepository;
  let categoryRepository: InMemoryCategoryRepository;
  let storeRepository: InMemoryStoreRepository;
  let getProductByIdService: GetProductByIdService;

  beforeEach(() => {
    productRepository = new InMemoryProductRepository();
    categoryRepository = new InMemoryCategoryRepository();
    storeRepository = new InMemoryStoreRepository();
    getProductByIdService = new GetProductByIdService(
      productRepository,
      storeRepository,
      categoryRepository
    );
  });

  it("should return a product with category and store if it exists", async () => {
    // Registrando categoria e loja no repositório in-memory
    const categoryCreated = await categoryRepository.register({
      id: "category123",
      title: "Categoria Teste",
      slug: "",
    });
  
    const storeCreated = await storeRepository.register(
      "Loja Teste",
      "Descrição da loja teste",
      "12.345.678/0001-99",
      "user123",
      "http://example.com/store.jpg"
    );
  
    // Registrando um produto no repositório in-memory
    const productCreated = await productRepository.register({
      title: "Produto Teste",
      slug: "produto-teste",
      imageUrl: "http://example.com/product.jpg",
      description: "Descrição do produto",
      priceInCents: 1000,
      stock: 10,
      categoryId: categoryCreated.id,
      storeId: storeCreated.id,
      isActive: true,
    });
  
    // Executando o serviço para buscar o produto pelo ID
    const response = await getProductByIdService.execute({ id: productCreated.id });
  
    // Construindo o objeto esperado manualmente para evitar discrepâncias
    const expectedProduct = {
      ...productCreated,
      category: categoryCreated,
      store: storeCreated,
      categoryId: undefined, // Removendo a propriedade desnecessária
      storeId: undefined,    // Removendo a propriedade desnecessária
    };
  
    // Verificando se o produto foi retornado com os objetos de categoria e loja
    expect(response.product).toEqual(expectedProduct);
    expect(response.error).toBeNull();
  });

  it("should return an error if product does not exist", async () => {
    const response = await getProductByIdService.execute({ id: "non-existing-id" });

    expect(response.product).toBeNull();
    expect(response.error).toBeInstanceOf(ProductNotFoundError);
  });

  it("should return an error if category does not exist", async () => {
    const storeCreated = await storeRepository.register(
      "Loja Teste",
      "Descrição da loja teste",
      "12.345.678/0001-99",
      "user123",
      "http://example.com/store.jpg"
    );

    const productCreated = await productRepository.register({
      title: "Produto Teste",
      slug: "produto-teste",
      imageUrl: "http://example.com/product.jpg",
      description: "Descrição do produto",
      priceInCents: 1000,
      stock: 10,
      categoryId: "non-existing-category",
      storeId: storeCreated.id,
      isActive: true,
    });

    const response = await getProductByIdService.execute({ id: productCreated.id });

    expect(response.product).toBeNull();
    expect(response.error).toBeInstanceOf(CategoryNotFoundError);
  });

  it("should return an error if store does not exist", async () => {
    const categoryCreated = await categoryRepository.register({
      id: "category123",
      title: "Categoria Teste",
      slug: "",
    });

    const productCreated = await productRepository.register({
      title: "Produto Teste",
      slug: "produto-teste",
      imageUrl: "http://example.com/product.jpg",
      description: "Descrição do produto",
      priceInCents: 1000,
      stock: 10,
      categoryId: categoryCreated.id,
      storeId: "non-existing-store",
      isActive: true,
    });

    const response = await getProductByIdService.execute({ id: productCreated.id });

    expect(response.product).toBeNull();
    expect(response.error).toBeInstanceOf(StoreNotFoundError);
  });
});
