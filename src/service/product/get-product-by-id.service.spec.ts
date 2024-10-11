import { GetProductByIdService } from "./get-product-by-id.service";
import { InMemoryProductRepository } from "../../repository/in-memory-repository/in-memory-product-repository";
import { ProductNotFoundError } from "../error/product-not-found-error";

describe("GetProductByIdService", () => {
  let productRepository: InMemoryProductRepository;
  let getProductByIdService: GetProductByIdService;

  // Configuração antes de cada teste
  beforeEach(() => {
    productRepository = new InMemoryProductRepository();
    getProductByIdService = new GetProductByIdService(productRepository);
  });

  it("should return a product if it exists", async () => {
    // Registrando um produto no repositório in-memory
    const productCreated = await productRepository.register({
      title: "Produto Teste",
      slug: "produto-teste",
      imageUrl: "http://example.com/product.jpg",
      description: "Descrição do produto",
      priceInCents: 1000,
      stock: 10,
      categoryId: "category123",
      storeId: "store123",
      isActive: true,
    });

    // Executando o serviço para buscar o produto pelo ID
    const response = await getProductByIdService.execute({ id: productCreated.id });

    // Verificando se o produto foi retornado corretamente
    expect(response.product).toEqual(productCreated);
    expect(response.error).toBeNull();
  });

  it("should return an error if product does not exist", async () => {
    // Tentando buscar um produto que não existe
    const response = await getProductByIdService.execute({ id: "non-existing-id" });

    // Verificando se o erro ProductNotFoundError foi retornado
    expect(response.product).toBeNull();
    expect(response.error).toBeInstanceOf(ProductNotFoundError);
  });
});
