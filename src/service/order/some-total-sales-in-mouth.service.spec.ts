import { TotalSalesInMonthSomeService } from "./some-total-sales-in-mouth.service";
import { InMemoryStoreRepository } from "../../repository/in-memory-repository/in-memory-store-repository";
import { InMemoryOrderRepository } from "../../repository/in-memory-repository/in-memory-order-repository";
import { StoreNotFoundError } from "../error/store-not-found-error";

describe("TotalSalesInMonthSomeService", () => {
  let storeRepository: InMemoryStoreRepository;
  let orderRepository: InMemoryOrderRepository;
  let totalSalesInMonthSomeService: TotalSalesInMonthSomeService;

  beforeEach(() => {
    storeRepository = new InMemoryStoreRepository();
    orderRepository = new InMemoryOrderRepository();
    totalSalesInMonthSomeService = new TotalSalesInMonthSomeService(
      storeRepository,
      orderRepository
    );
  });

  it("should return total sales in month if store exists", async () => {
    // Registrando uma loja no repositório
    const store = await storeRepository.register(
      "Loja Exemplo",         // title
      "Descrição da Loja",     // description
      "12345678000199",        // cnpj
      "user123",               // userId
      "https://example.com/image.jpg" // imageUrl
    );
  
    // Registrando vendas no repositório de pedidos
    await orderRepository.register({
      storeId: store.id,
      customerId: "customer123",
      fullPriceOrderInCents: 10000, // R$ 100,00
      status: "processing",
      created_at: new Date(), // Venda neste mês
    });
  
    await orderRepository.register({
      storeId: store.id,
      customerId: "customer456",
      fullPriceOrderInCents: 5000, // R$ 50,00
      status: "processing",
      created_at: new Date(), // Venda neste mês
    });
  
    // Executando o serviço
    const response = await totalSalesInMonthSomeService.execute({ storeId: store.id });
  
    // Verificando se o total de vendas foi calculado corretamente
    expect(response.totalSalesInMonth).toBe(2); // 2 sales
    expect(response.error).toBeNull();
  });
  
});
