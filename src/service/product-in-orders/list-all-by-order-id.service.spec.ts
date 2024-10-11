import { ListAllProductsInOrdersByOrderId } from "./list-all-by-order-id.service";
import { InMemoryProductInOrderRepository } from "../../repository/in-memory-repository/in-memory-product-in-orders-repository";
import { InMemoryOrderRepository } from "../../repository/in-memory-repository/in-memory-order-repository";
import { OrderNotFoundError } from "../error/order-not-found-error";

describe("ListAllProductsInOrdersByOrderId", () => {
  let productInOrderRepository: InMemoryProductInOrderRepository;
  let orderRepository: InMemoryOrderRepository;
  let listAllProductsInOrdersByOrderIdService: ListAllProductsInOrdersByOrderId;

  // Configurando o repositório e o serviço antes de cada teste
  beforeEach(() => {
    productInOrderRepository = new InMemoryProductInOrderRepository();
    orderRepository = new InMemoryOrderRepository();
    listAllProductsInOrdersByOrderIdService = new ListAllProductsInOrdersByOrderId(productInOrderRepository, orderRepository);
  });

  it("should return products in orders if order exists", async () => {
    // Registrando uma ordem no repositório in-memory
    const order = await orderRepository.register({
      storeId: "store123",
      customerId: "customer123",
      fullPriceOrderInCents: 1000,
      status: "pending"
    });

    // Registrando produtos para essa ordem
    await productInOrderRepository.register({
      orderId: order.id,
      productId: "product123",
      quantity: 2
    });

    await productInOrderRepository.register({
      orderId: order.id,
      productId: "product456",
      quantity: 1
    });

    // Executando o serviço para listar todos os produtos da ordem
    const response = await listAllProductsInOrdersByOrderIdService.execute({ orderId: order.id });

    // Verificando se os produtos foram retornados corretamente
    expect(response.productsInOrders).toHaveLength(2);
    expect(response.error).toBeNull();
  });

  it("should return an error if order does not exist", async () => {
    // Tentando listar produtos de uma ordem inexistente
    const response = await listAllProductsInOrdersByOrderIdService.execute({ orderId: "non-existing-order" });

    // Verificando se o erro de ordem não encontrada foi retornado
    expect(response.productsInOrders).toBeNull();
    expect(response.error).toBeInstanceOf(OrderNotFoundError);
  });
});
