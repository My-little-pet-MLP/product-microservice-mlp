import { ListAllByCustomerIdService } from "./list-all-by-customer-id.service";
import { InMemoryOrderRepository } from "../../repository/in-memory-repository/in-memory-order-repository";
import { clearkClientCustomer } from "../../lib/cleark";
import { CustomerNotFoundError } from "../error/customer-not-found-error";

// Mock da API do clearkClientCustomer
jest.mock("../../lib/cleark");

describe("ListAllByCustomerIdService", () => {
  let orderRepository: InMemoryOrderRepository;
  let listAllByCustomerIdService: ListAllByCustomerIdService;

  // Configurando o repositório e o serviço antes de cada teste
  beforeEach(() => {
    orderRepository = new InMemoryOrderRepository();
    listAllByCustomerIdService = new ListAllByCustomerIdService(orderRepository);
    jest.clearAllMocks(); // Limpar mocks antes de cada teste
  });

  it("should return orders for a valid customer", async () => {
    // Mock para simular que o cliente existe
    (clearkClientCustomer.users.getUser as jest.Mock).mockResolvedValue({
      id: "customer123",
      email: "customer@example.com",
    });

    // Registrando pedidos no repositório in-memory
    await orderRepository.register({
      fullPriceOrderInCents: 5000,
      storeId: "store123",
      status: "pending",
      customerId: "customer123"
    });

    await orderRepository.register({
      fullPriceOrderInCents: 3000,
      storeId: "store123",
      status: "shipped",
      customerId: "customer123"
    });

    // Executando o serviço para listar os pedidos
    const response = await listAllByCustomerIdService.execute({
      customerId: "customer123",
      page: 1,
      size: 2
    });

    // Verificando se os pedidos foram retornados corretamente
    expect(response.orders).toHaveLength(2);
    expect(response.totalPages).toBe(1); // Apenas 2 pedidos, 1 página
    expect(response.error).toBeNull();
  });

  it("should return an error if customer does not exist", async () => {
    // Mock para simular que o cliente não existe
    (clearkClientCustomer.users.getUser as jest.Mock).mockResolvedValue(null);

    // Executando o serviço com um customerId inexistente
    const response = await listAllByCustomerIdService.execute({
      customerId: "non-existing-customer",
      page: 1,
      size: 2
    });

    // Verificando se o erro de cliente não encontrado foi retornado
    expect(response.orders).toBeNull();
    expect(response.totalPages).toBeNull();
    expect(response.error).toBeInstanceOf(CustomerNotFoundError);
  });
});
