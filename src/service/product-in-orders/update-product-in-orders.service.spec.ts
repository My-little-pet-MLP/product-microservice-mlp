import { UpdateProductInOrdersService } from "./update-product-in-orders.service";
import { InMemoryProductInOrderRepository } from "../../repository/in-memory-repository/in-memory-product-in-orders-repository";
import { InMemoryOrderRepository } from "../../repository/in-memory-repository/in-memory-order-repository";
import { InMemoryProductRepository } from "../../repository/in-memory-repository/in-memory-product-repository";
import { QuantityIsNegativeError } from "../error/quantity-is-negative-error";
import { ProductNotFoundError } from "../error/product-not-found-error";
import { OrderNotFoundError } from "../error/order-not-found-error";
import { OrderIsNotPedingError } from "../error/order-is-not-peding-error";

describe("UpdateProductInOrdersService", () => {
  let productInOrderRepository: InMemoryProductInOrderRepository;
  let orderRepository: InMemoryOrderRepository;
  let productRepository: InMemoryProductRepository;
  let updateProductInOrdersService: UpdateProductInOrdersService;

  beforeEach(() => {
    productInOrderRepository = new InMemoryProductInOrderRepository();
    orderRepository = new InMemoryOrderRepository();
    productRepository = new InMemoryProductRepository();
    updateProductInOrdersService = new UpdateProductInOrdersService(
      productInOrderRepository,
      orderRepository,
      productRepository
    );
  });

  it("should update a product in a pending order", async () => {
    // Usando o ID real do usuário vindo do Clerk
    const customerId = "user_2nGoQ6dlEVeMPTc9bpZCci9uJcK";

    // Criando produto e pedido pendente
    const product = await productRepository.register({
      title: "Product Test",
      slug: "product-test",
      imageUrl: "http://example.com/product.jpg",
      description: "Test description",
      priceInCents: 1000,
      stock: 10,
      categoryId: "category123",
      storeId: "store123",
      isActive: true,
    });

    const order = await orderRepository.register({
      customerId,
      fullPriceOrderInCents: 1000,
      status: "pending",
      storeId: product.storeId,
    });

    const productInOrder = await productInOrderRepository.register({
      orderId: order.id,
      productId: product.id,
      quantity: 1,
    });

    // Atualizando o produto no pedido
    const response = await updateProductInOrdersService.execute({
      id: productInOrder.id,
      customerId,
      productId: product.id,
      quantity: 5,
    });

    expect(response.productInOrders).toBeTruthy();
    expect(response.productInOrders?.quantity).toBe(5);
    expect(response.error).toBeNull();
  });

  it("should return error if product does not exist", async () => {
    // Usando o ID real do usuário vindo do Clerk
    const customerId = "user_2nGoQ6dlEVeMPTc9bpZCci9uJcK";

    // Tentando atualizar um produto inexistente
    const response = await updateProductInOrdersService.execute({
      id: "non-existent-product",
      customerId,
      productId: "invalid-product",
      quantity: 1,
    });

    expect(response.productInOrders).toBeNull();
    expect(response.error).toBeInstanceOf(ProductNotFoundError);
  });

  it("should return error if quantity is negative", async () => {
    // Usando o ID real do usuário vindo do Clerk
    const customerId = "user_2nGoQ6dlEVeMPTc9bpZCci9uJcK";

    const product = await productRepository.register({
      title: "Product Test",
      slug: "product-test",
      imageUrl: "http://example.com/product.jpg",
      description: "Test description",
      priceInCents: 1000,
      stock: 10,
      categoryId: "category123",
      storeId: "store123",
      isActive: true,
    });

    const order = await orderRepository.register({
      customerId,
      fullPriceOrderInCents: 1000,
      status: "pending",
      storeId: product.storeId,
    });

    const productInOrder = await productInOrderRepository.register({
      orderId: order.id,
      productId: product.id,
      quantity: 1,
    });

    // Tentando atualizar com quantidade negativa
    const response = await updateProductInOrdersService.execute({
      id: productInOrder.id,
      customerId,
      productId: product.id,
      quantity: -1,
    });

    expect(response.productInOrders).toBeNull();
    expect(response.error).toBeInstanceOf(QuantityIsNegativeError);
  });

  it("should return error if existing order is not pending", async () => {
    // Usando o ID real do usuário vindo do Clerk
    const customerId = "user_2nGoQ6dlEVeMPTc9bpZCci9uJcK";

    // Criando produto e pedido com status diferente de pendente
    const product = await productRepository.register({
      title: "Product Test",
      slug: "product-test",
      imageUrl: "http://example.com/product.jpg",
      description: "Test description",
      priceInCents: 1000,
      stock: 10,
      categoryId: "category123",
      storeId: "store123",
      isActive: true,
    });

    await orderRepository.register({
      customerId,
      fullPriceOrderInCents: 1000,
      status: "shipped", // Status não pendente
      storeId: product.storeId,
    });

    const productInOrder = await productInOrderRepository.register({
      orderId: "non-pending-order-id",
      productId: product.id,
      quantity: 1,
    });

    // Tentando atualizar o produto em um pedido não pendente
    const response = await updateProductInOrdersService.execute({
      id: productInOrder.id,
      customerId,
      productId: product.id,
      quantity: 1,
    });

    expect(response.productInOrders).toBeNull();
    expect(response.error).toBeInstanceOf(OrderIsNotPedingError);
  });
});
