import { ConfirmOrderService } from "./confirm-order.service";
import { InMemoryOrderRepository } from "../../repository/in-memory-repository/in-memory-order-repository";
import { InMemoryProductRepository } from "../../repository/in-memory-repository/in-memory-product-repository";
import { InMemoryProductInOrderRepository } from "../../repository/in-memory-repository/in-memory-product-in-orders-repository";
import { OrderNotFoundError } from "../error/order-not-found-error";
import { ProductNotFoundError } from "../error/product-not-found-error";
import { InsufficientStockError } from "../error/insufficient-stock-error";
import { OrderDoesNotHaveProductInOrderRegisted } from "../error/order-does-not-have-productinorder-registed";
import { $Enums } from "@prisma/client";

describe("ConfirmOrderService", () => {
  let orderRepository: InMemoryOrderRepository;
  let productRepository: InMemoryProductRepository;
  let productInOrderRepository: InMemoryProductInOrderRepository;
  let confirmOrderService: ConfirmOrderService;

  // Configurando os repositórios e o serviço antes de cada teste
  beforeEach(() => {
    orderRepository = new InMemoryOrderRepository();
    productRepository = new InMemoryProductRepository();
    productInOrderRepository = new InMemoryProductInOrderRepository();
    confirmOrderService = new ConfirmOrderService(orderRepository, productRepository, productInOrderRepository);
  });

  it("should confirm the order successfully if all conditions are met", async () => {
    // Registrando produtos e um pedido no repositório in-memory
    const product = await productRepository.register({
      title: "Produto Teste",
      slug: "produto-teste",
      imageUrl: "http://example.com/product.jpg",
      description: "Descrição do produto",
      priceInCents: 1000,
      stock: 10,
      categoryId: "category123",
      storeId: "store123",
      isActive: true
    });

    const order = await orderRepository.register({
      fullPriceOrderInCents: 0,
      storeId: "store123",
      status: $Enums.OrderStatus.pending,
      customerId: "customer123"
    });

    // Registrando o produto no pedido
    await productInOrderRepository.register({
      orderId: order.id,
      productId: product.id,
      quantity: 2
    });

    // Executando o serviço para confirmar o pedido
    const response = await confirmOrderService.execute({ id: order.id });

    // Verificando se o pedido foi confirmado corretamente
    expect(response.order).toBeTruthy();
    expect(response.order?.fullPriceOrderInCents).toBe(2000); // 2 produtos de 1000 cada
    expect(response.error).toBeNull();
  });

  it("should return an error if the order does not exist", async () => {
    // Tentando confirmar um pedido inexistente
    const response = await confirmOrderService.execute({ id: "non-existing-order-id" });

    // Verificando se o erro de pedido não encontrado foi retornado
    expect(response.order).toBeNull();
    expect(response.error).toBeInstanceOf(OrderNotFoundError);
  });

  it("should return an error if there are no products in the order", async () => {
    // Registrando um pedido sem produtos no repositório in-memory
    const order = await orderRepository.register({
      fullPriceOrderInCents: 0,
      storeId: "store123",
      status: $Enums.OrderStatus.pending,
      customerId: "customer123"
    });

    // Executando o serviço para confirmar o pedido sem produtos
    const response = await confirmOrderService.execute({ id: order.id });

    // Verificando se o erro de "OrderDoesNotHaveProductInOrderRegisted" foi retornado
    expect(response.order).toBeNull();
    expect(response.error).toBeInstanceOf(OrderDoesNotHaveProductInOrderRegisted);
  });

  it("should return an error if the product does not exist", async () => {
    // Registrando um pedido no repositório in-memory
    const order = await orderRepository.register({
      fullPriceOrderInCents: 0,
      storeId: "store123",
      status: $Enums.OrderStatus.pending,
      customerId: "customer123"
    });

    // Registrando um produto no pedido, mas o produto não existe no repositório de produtos
    await productInOrderRepository.register({
      orderId: order.id,
      productId: "non-existing-product-id",
      quantity: 1
    });

    // Executando o serviço para confirmar o pedido
    const response = await confirmOrderService.execute({ id: order.id });

    // Verificando se o erro de produto não encontrado foi retornado
    expect(response.order).toBeNull();
    expect(response.error).toBeInstanceOf(ProductNotFoundError);
  });

  it("should return an error if there is insufficient stock", async () => {
    // Registrando um produto com estoque insuficiente no repositório in-memory
    const product = await productRepository.register({
      title: "Produto Teste",
      slug: "produto-teste",
      imageUrl: "http://example.com/product.jpg",
      description: "Descrição do produto",
      priceInCents: 1000,
      stock: 1, // Apenas 1 item em estoque
      categoryId: "category123",
      storeId: "store123",
      isActive: true
    });

    const order = await orderRepository.register({
      fullPriceOrderInCents: 0,
      storeId: "store123",
      status: $Enums.OrderStatus.pending,
      customerId: "customer123"
    });

    // Registrando o produto no pedido com uma quantidade maior que o estoque disponível
    await productInOrderRepository.register({
      orderId: order.id,
      productId: product.id,
      quantity: 2 // Solicitando 2, mas há apenas 1 em estoque
    });

    // Executando o serviço para confirmar o pedido
    const response = await confirmOrderService.execute({ id: order.id });

    // Verificando se o erro de estoque insuficiente foi retornado
    expect(response.order).toBeNull();
    expect(response.error).toBeInstanceOf(InsufficientStockError);
  });
});
