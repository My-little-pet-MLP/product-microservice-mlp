import { UpdateProductService } from "./update-product.service";
import { InMemoryProductRepository } from "../../repository/in-memory-repository/in-memory-product-repository";
import { ProductNotFoundError } from "../error/product-not-found-error";
import { generateSlug } from "../../utils/genereate-slug";

jest.mock("../../utils/genereate-slug"); // Mock do utilitário de geração de slug

describe("UpdateProductService", () => {
  let productRepository: InMemoryProductRepository;
  let updateProductService: UpdateProductService;

  // Configurando o repositório e o serviço antes de cada teste
  beforeEach(() => {
    productRepository = new InMemoryProductRepository();
    updateProductService = new UpdateProductService(productRepository);
    jest.clearAllMocks();
  });

  it("should update a product successfully", async () => {
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

    // Mock da função generateSlug
    const mockSlug = "produto-atualizado";
    (generateSlug as jest.Mock).mockReturnValue(mockSlug);

    // Atualizando o produto
    const response = await updateProductService.execute({
      id: productCreated.id,
      title: "Produto Atualizado",
      imageUrl: "http://example.com/product-updated.jpg",
      description: "Descrição atualizada",
      priceInCents: 1200,
      stock: 20,
      categoryId: "category123",
    });

    // Verificando a resposta
    expect(response.product).toBeTruthy();
    expect(response.product?.title).toBe("Produto Atualizado");
    expect(response.product?.slug).toBe(mockSlug);
    expect(response.product?.imageUrl).toBe("http://example.com/product-updated.jpg");
    expect(response.product?.description).toBe("Descrição atualizada");
    expect(response.product?.priceInCents).toBe(1200);
    expect(response.product?.stock).toBe(20);
    expect(response.error).toBeNull();
  });

  it("should return an error if product does not exist", async () => {
    // Tentando atualizar um produto inexistente
    const response = await updateProductService.execute({
      id: "non-existing-product-id",
      title: "Produto Inexistente",
      imageUrl: "http://example.com/non-existent-product.jpg",
      description: "Descrição do produto inexistente",
      priceInCents: 1500,
      stock: 15,
      categoryId: "category123",
    });

    // Verificando se retornou erro de produto não encontrado
    expect(response.product).toBeNull();
    expect(response.error).toBeInstanceOf(ProductNotFoundError);
  });
});
