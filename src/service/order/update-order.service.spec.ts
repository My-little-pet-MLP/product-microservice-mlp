import { UpdateOrderService } from "./update-order.service";
import { InMemoryOrderRepository } from "../../repository/in-memory-repository/in-memory-order-repository";
import { OrderNotFoundError } from "../error/order-not-found-error";
import { $Enums } from "@prisma/client";

describe("UpdateOrderService", () => {
  let orderRepository: InMemoryOrderRepository;
  let updateOrderService: UpdateOrderService;

  // Configurando o repositório e o serviço antes de cada teste
  beforeEach(() => {
    orderRepository = new InMemoryOrderRepository();
    updateOrderService = new UpdateOrderService(orderRepository);
  });

  it("should update an order status successfully if the order exists", async () => {
    // Registrando um pedido no repositório in-memory
    const order = await orderRepository.register({
      fullPriceOrderInCents: 5000,
      storeId: "store123",
      status: $Enums.OrderStatus.pending,
      customerId: "customer123"
    });

    // Executando o serviço para atualizar o status do pedido
    const response = await updateOrderService.execute({
      id: order.id,
      status: $Enums.OrderStatus.shipped
    });

    // Verificando se o pedido foi atualizado corretamente
    expect(response.order).toBeTruthy();
    expect(response.order?.status).toBe($Enums.OrderStatus.shipped);
    expect(response.error).toBeNull();
  });

  it("should return an error if the order does not exist", async () => {
    // Tentando atualizar um pedido inexistente
    const response = await updateOrderService.execute({
      id: "non-existing-order-id",
      status: $Enums.OrderStatus.shipped
    });

    // Verificando se o erro de pedido não encontrado foi retornado
    expect(response.order).toBeNull();
    expect(response.error).toBeInstanceOf(OrderNotFoundError);
  });
});
