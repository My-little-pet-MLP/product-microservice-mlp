import { TotalBillingMonthSomeService } from "./total-billing-month-some.service";
import { InMemoryStoreRepository } from "../../repository/in-memory-repository/in-memory-store-repository";
import { InMemoryOrderRepository } from "../../repository/in-memory-repository/in-memory-order-repository";
import { StoreNotFoundError } from "../error/store-not-found-error";

describe("TotalBillingMonthSomeService", () => {
  let storeRepository: InMemoryStoreRepository;
  let orderRepository: InMemoryOrderRepository;
  let totalBillingMonthSomeService: TotalBillingMonthSomeService;

  // Configurando o repositório e serviço antes de cada teste
  beforeEach(() => {
    storeRepository = new InMemoryStoreRepository();
    orderRepository = new InMemoryOrderRepository();
    totalBillingMonthSomeService = new TotalBillingMonthSomeService(
      storeRepository,
      orderRepository
    );
  });

  it("should return total billing for the month if store exists", async () => {
    // Registrando uma loja no repositório in-memory
    const store = await storeRepository.register(
        "Loja Exemplo",         // title
        "Descrição da Loja",     // description
        "12345678000199",        // cnpj
        "user123",               // userId
        "https://example.com/image.jpg" // imageUrl
      );

    // Registrando pedidos para a loja
    await orderRepository.register({
      storeId: store.id,
      customerId: "customer123",
      fullPriceOrderInCents: 10000, // R$ 100,00
      status: "processing",
      created_at: new Date(), // Pedido deste mês
    });

    await orderRepository.register({
      storeId: store.id,
      customerId: "customer456",
      fullPriceOrderInCents: 5000, // R$ 50,00
      status: "delivered",
      created_at: new Date(), // Pedido deste mês
    });

    // Executando o serviço
    const response = await totalBillingMonthSomeService.execute({ storeId: store.id });

    // Verificando se o total foi calculado corretamente
    expect(response.total).toBe(15000); // R$ 150,00
    expect(response.error).toBeNull();
  });

  it("should return an error if store does not exist", async () => {
    // Tentando calcular o faturamento para uma loja inexistente
    const response = await totalBillingMonthSomeService.execute({ storeId: "non-existing-store" });

    // Verificando se o erro foi retornado corretamente
    expect(response.total).toBeNull();
    expect(response.error).toBeInstanceOf(StoreNotFoundError);
  });
});
