import { ListAllOrdersByStoreIdService } from "./list-all-orders-by-store-id.service";
import { InMemoryOrderRepository } from "../../repository/in-memory-repository/in-memory-order-repository";
import { InMemoryStoreRepository } from "../../repository/in-memory-repository/in-memory-store-repository";
import { StoreNotFoundError } from "../error/store-not-found-error";

describe("ListAllOrdersByStoreIdService", () => {
  let orderRepository: InMemoryOrderRepository;
  let storeRepository: InMemoryStoreRepository;
  let listAllOrdersByStoreIdService: ListAllOrdersByStoreIdService;

  // Configurando os repositórios e o serviço antes de cada teste
  beforeEach(() => {
    orderRepository = new InMemoryOrderRepository();
    storeRepository = new InMemoryStoreRepository();
    listAllOrdersByStoreIdService = new ListAllOrdersByStoreIdService(orderRepository, storeRepository);
  });

  it("should return orders for a valid store", async () => {
    // Registrando uma loja no repositório in-memory
    const store = await storeRepository.register(
      "Loja Teste",
      "Descrição da loja",
      "12345678901234",
      "user123",
      "http://example.com/store.jpg"
    );

    // Registrando pedidos no repositório in-memory
    await orderRepository.register({
      fullPriceOrderInCents: 5000,
      storeId: store.id,
      status: "pending",
      customerId: "customer123",
    });

    await orderRepository.register({
      fullPriceOrderInCents: 10000,
      storeId: store.id,
      status: "shipped",
      customerId: "customer456",
    });

    // Executando o serviço para listar os pedidos da loja
    const response = await listAllOrdersByStoreIdService.execute({
      storeId: store.id,
      page: 1,
      size: 10
    });

    // Verificando se os pedidos foram retornados corretamente
    expect(response.orders).toHaveLength(2);
    expect(response.totalPages).toBe(1); // Apenas 2 pedidos, 1 página
    expect(response.error).toBeNull();
  });

  it("should return an error if store does not exist", async () => {
    // Tentando listar pedidos de uma loja inexistente
    const response = await listAllOrdersByStoreIdService.execute({
      storeId: "non-existing-store-id",
      page: 1,
      size: 10
    });

    // Verificando se o erro de loja não encontrada foi retornado
    expect(response.orders).toBeNull();
    expect(response.totalPages).toBeNull();
    expect(response.error).toBeInstanceOf(StoreNotFoundError);
  });
});
