import { GetProductInOrderByIdService } from "./get-product-in-order-by-id.service";
import { InMemoryProductInOrderRepository } from "../../repository/in-memory-repository/in-memory-product-in-orders-repository";
import { ProductInOrdersNotFoundError } from "../error/product-in-orders-not-found-error";

describe("GetProductInOrderByIdService", () => {
  let productInOrderRepository: InMemoryProductInOrderRepository;
  let getProductInOrderByIdService: GetProductInOrderByIdService;

  // Configurando o repositório e o serviço antes de cada teste
  beforeEach(() => {
    productInOrderRepository = new InMemoryProductInOrderRepository();
    getProductInOrderByIdService = new GetProductInOrderByIdService(productInOrderRepository);
  });

  it("should return the product in order if it exists", async () => {
    // Registrando um produto em um pedido no repositório in-memory
    const productInOrder = await productInOrderRepository.register({
      orderId: "order123",
      productId: "product123",
      quantity: 2,
    });

    // Executando o serviço para buscar o produto pelo ID
    const response = await getProductInOrderByIdService.execute({ id: productInOrder.id });

    // Verificando se o produto foi retornado corretamente
    expect(response.productInOrder).not.toBeNull(); // Verifica se não é null
    
    // Usa uma verificação para garantir ao TypeScript que productInOrder não é null
    if (response.productInOrder !== null) {
      expect(response.productInOrder.id).toBe(productInOrder.id);
      expect(response.productInOrder.orderId).toBe(productInOrder.orderId);
      expect(response.productInOrder.quantity).toBe(productInOrder.quantity);
    }

    expect(response.error).toBeNull();
  });

  it("should return an error if the product in order does not exist", async () => {
    // Tentando buscar um produto inexistente
    const response = await getProductInOrderByIdService.execute({ id: "non-existing-id" });

    // Verificando se o erro de produto em pedido não encontrado foi retornado
    expect(response.productInOrder).toBeNull();
    expect(response.error).toBeInstanceOf(ProductInOrdersNotFoundError);
  });
});
