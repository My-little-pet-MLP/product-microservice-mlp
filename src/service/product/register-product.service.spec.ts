import { RegisterProductService } from "./register-product.service";
import { InMemoryProductRepository } from "../../repository/in-memory-repository/in-memory-product-repository";
import { InMemoryStoreRepository } from "../../repository/in-memory-repository/in-memory-store-repository";
import { InMemoryCategoryRepository } from "../../repository/in-memory-repository/in-memory-category-repository";
import { StoreNotFoundError } from "../error/store-not-found-error";
import { UnRegisterCategoryError } from "../error/unregister-category-error";
import { ErrorRegisteringProductError } from "../error/error-registering-product-error";

describe("RegisterProductService", () => {
  let productRepository: InMemoryProductRepository;
  let storeRepository: InMemoryStoreRepository;
  let categoryRepository: InMemoryCategoryRepository;
  let registerProductService: RegisterProductService;

  beforeEach(() => {
    productRepository = new InMemoryProductRepository();
    storeRepository = new InMemoryStoreRepository();
    categoryRepository = new InMemoryCategoryRepository();
    registerProductService = new RegisterProductService(productRepository, storeRepository, categoryRepository);
  });

  it("should register a product if store and category exist", async () => {
    // Registrando loja e categoria no repositório
    const store = await storeRepository.register(
        "Loja Teste",
        "Descrição da loja",
        "12345678901234",
        "user123",
        "http://example.com/store.jpg"
      );

    const category = await categoryRepository.register({
      title: "Categoria Teste",
      slug: "categoria-teste",
    });

    // Executando o serviço de cadastro de produto
    const response = await registerProductService.execute({
      title: "Produto Teste",
      imageUrl: "http://example.com/product.jpg",
      description: "Descrição do produto",
      priceInCents: 1000,
      stock: 10,
      categoryId: category.id,
      storeId: store.id,
    });

    // Verificando se o produto foi registrado corretamente
    expect(response.productRegister).toHaveProperty("id");
    expect(response.error).toBeNull();
  });

  it("should return an error if store does not exist", async () => {
    const category = await categoryRepository.register({
      title: "Categoria Teste",
      slug: "categoria-teste",
    });

    // Tentando registrar um produto em uma loja que não existe
    const response = await registerProductService.execute({
      title: "Produto Teste",
      imageUrl: "http://example.com/product.jpg",
      description: "Descrição do produto",
      priceInCents: 1000,
      stock: 10,
      categoryId: category.id,
      storeId: "non-existing-store",
    });

    // Verificando se o erro de loja não encontrada foi retornado
    expect(response.productRegister).toBeNull();
    expect(response.error).toBeInstanceOf(StoreNotFoundError);
  });

  it("should return an error if category does not exist", async () => {
    const store = await storeRepository.register(
        "Loja Teste",
        "Descrição da loja",
        "12345678901234",
        "user123",
        "http://example.com/store.jpg"
      );

    // Tentando registrar um produto em uma categoria que não existe
    const response = await registerProductService.execute({
      title: "Produto Teste",
      imageUrl: "http://example.com/product.jpg",
      description: "Descrição do produto",
      priceInCents: 1000,
      stock: 10,
      categoryId: "non-existing-category",
      storeId: store.id,
    });

    // Verificando se o erro de categoria não registrada foi retornado
    expect(response.productRegister).toBeNull();
    expect(response.error).toBeInstanceOf(UnRegisterCategoryError);
  });
});
