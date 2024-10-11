import { DeleteProductService } from "./delete-product.service";
import { InMemoryProductRepository } from "../../repository/in-memory-repository/in-memory-product-repository";
import { ProductNotFoundError } from "../error/product-not-found-error";

describe("DeleteProductService", () => {
  let productRepository: InMemoryProductRepository;
  let deleteProductService: DeleteProductService;

  // Configurando o repositório e o serviço antes de cada teste
  beforeEach(() => {
    productRepository = new InMemoryProductRepository();
    deleteProductService = new DeleteProductService(productRepository);
  });

  it("should deactivate a product if it exists", async () => {
    // Primeiro, registramos um produto no repositório in-memory
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
  
    // Agora, deletamos (desativamos) o produto utilizando o serviço
    const response = await deleteProductService.execute({ id: productCreated.id });
  
    // Verificamos se o produto foi desativado com sucesso e não houve erro
    expect(response.product).toBeNull();
    expect(response.error).toBeNull();
  
    // Verifica se o produto foi desativado (isActive: false)
    const productAfterDelete = await productRepository.getById(productCreated.id);
    expect(productAfterDelete).not.toBeNull();
    expect(productAfterDelete?.isActive).toBe(false);  // O produto foi desativado
  });

  it("should return an error if product does not exist", async () => {
    // Tentando deletar um produto que não existe
    const response = await deleteProductService.execute({ id: "non-existing-id" });

    // Verifica se retornou um erro de produto não encontrado
    expect(response.product).toBeNull();
    expect(response.error).toBeInstanceOf(ProductNotFoundError);
  });
});
