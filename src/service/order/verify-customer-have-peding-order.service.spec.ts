import { VerifyCustomerHavePedingOrderService } from "./verify-customer-have-peding-order.service";
import { InMemoryOrderRepository } from "../../repository/in-memory-repository/in-memory-order-repository";
import { OrderNotFoundError } from "../error/order-not-found-error";
import { $Enums } from "@prisma/client";

describe("VerifyCustomerHavePedingOrderService", () => {
  let orderRepository: InMemoryOrderRepository;
  let verifyCustomerHavePedingOrderService: VerifyCustomerHavePedingOrderService;

  // Configurando o repositório e o serviço antes de cada teste
  beforeEach(() => {
    orderRepository = new InMemoryOrderRepository();
    verifyCustomerHavePedingOrderService = new VerifyCustomerHavePedingOrderService(orderRepository);
  });

  it("should return a pending order if it exists for the customer and store", async () => {
    // Registrando um pedido no repositório in-memory com status "pending"
    const order = await orderRepository.register({
      fullPriceOrderInCents: 5000,
      storeId: "store123",
      status: $Enums.OrderStatus.pending,
      customerId: "customer123"
    });

    // Executando o serviço para verificar se há um pedido pendente para o cliente e loja
    const response = await verifyCustomerHavePedingOrderService.execute({
      customerId: "customer123",
      storeId: "store123",
    });

    // Verificando se o pedido pendente foi encontrado corretamente
    expect(response.order).toBeTruthy();
    expect(response.order?.status).toBe($Enums.OrderStatus.pending);
    expect(response.error).toBeNull();
  });

  it("should return an error if no pending order exists for the customer and store", async () => {
    // Executando o serviço para verificar se há um pedido pendente para um cliente e loja sem pedidos
    const response = await verifyCustomerHavePedingOrderService.execute({
      customerId: "customer123",
      storeId: "store456",
    });

    // Verificando se o erro de pedido não encontrado foi retornado
    expect(response.order).toBeNull();
    expect(response.error).toBeInstanceOf(OrderNotFoundError);
  });
});
