import { GetByIdOrderService } from "./get-by-id-order.service";
import { InMemoryOrderRepository } from "../../repository/in-memory-repository/in-memory-order-repository";
import { OrderNotFoundError } from "../error/order-not-found-error";

describe("GetByIdOrderService", () => {
  let orderRepository: InMemoryOrderRepository;
  let getByIdOrderService: GetByIdOrderService;

  // Configurando o repositório e o serviço antes de cada teste
  beforeEach(() => {
    orderRepository = new InMemoryOrderRepository();
    getByIdOrderService = new GetByIdOrderService(orderRepository);
  });

  it("should return an order by id if it exists", async () => {
    // Registrando um pedido no repositório in-memory
    const order = await orderRepository.register({
      fullPriceOrderInCents: 5000,
      storeId: "store123",
      status: "pending",
      customerId: "customer123",
    });

    // Executando o serviço para buscar o pedido pelo ID
    const response = await getByIdOrderService.execute({ id: order.id });

    // Verificando se o pedido foi encontrado corretamente
    expect(response.order).toEqual(order);
    expect(response.error).toBeNull();
  });

  it("should return an error if order does not exist", async () => {
    // Tentando buscar um pedido que não existe
    const response = await getByIdOrderService.execute({ id: "non-existing-id" });

    // Verificando se o erro de pedido não encontrado foi retornado
    expect(response.order).toBeNull();
    expect(response.error).toBeInstanceOf(OrderNotFoundError);
  });
});
