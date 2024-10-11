import { RegisterOrderService } from "./register-order.service";
import { InMemoryOrderRepository } from "../../repository/in-memory-repository/in-memory-order-repository";
import { InMemoryStoreRepository } from "../../repository/in-memory-repository/in-memory-store-repository";
import { StoreNotFoundError } from "../error/store-not-found-error";

describe("RegisterOrderService", () => {
  let orderRepository: InMemoryOrderRepository;
  let storeRepository: InMemoryStoreRepository;
  let registerOrderService: RegisterOrderService;

  // Configurando os repositórios e o serviço antes de cada teste
  beforeEach(() => {
    orderRepository = new InMemoryOrderRepository();
    storeRepository = new InMemoryStoreRepository();
    registerOrderService = new RegisterOrderService(orderRepository, storeRepository);
  });

  it("should register an order successfully if the store exists", async () => {
    // Registrando uma loja no repositório in-memory
    const store = await storeRepository.register(
      "Loja Teste",
      "Descrição da loja",
      "12345678901234",
      "user123",
      "http://example.com/store.jpg"
    );

    // Executando o serviço para registrar o pedido
    const response = await registerOrderService.execute({
      storeId: store.id,
      customerId: "customer123",
    });

    // Verificando se o pedido foi registrado corretamente
    expect(response.order).toBeTruthy();
    expect(response.order?.storeId).toBe(store.id);
    expect(response.order?.status).toBe("pending");
    expect(response.error).toBeNull();
  });

  it("should return an error if the store does not exist", async () => {
    // Tentando registrar um pedido para uma loja inexistente
    const response = await registerOrderService.execute({
      storeId: "non-existing-store-id",
      customerId: "customer123",
    });

    // Verificando se o erro de loja não encontrada foi retornado
    expect(response.order).toBeNull();
    expect(response.error).toBeInstanceOf(StoreNotFoundError);
  });
});
