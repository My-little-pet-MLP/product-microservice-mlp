import { RegisterProductInOrdersService } from "./register-product-in-orders.service";
import { InMemoryProductInOrderRepository } from "../../repository/in-memory-repository/in-memory-product-in-orders-repository";
import { InMemoryOrderRepository } from "../../repository/in-memory-repository/in-memory-order-repository";
import { InMemoryProductRepository } from "../../repository/in-memory-repository/in-memory-product-repository";
import { QuantityIsNegativeError } from "../error/quantity-is-negative-error";
import { OrderIsNotPedingError } from "../error/order-is-not-peding-error";
import { ProductNotFoundError } from "../error/product-not-found-error";

describe("RegisterProductInOrdersService", () => {
  let productInOrderRepository: InMemoryProductInOrderRepository;
  let orderRepository: InMemoryOrderRepository;
  let productRepository: InMemoryProductRepository;
  let registerProductInOrdersService: RegisterProductInOrdersService;

  beforeEach(() => {
    productInOrderRepository = new InMemoryProductInOrderRepository();
    orderRepository = new InMemoryOrderRepository();
    productRepository = new InMemoryProductRepository();
    registerProductInOrdersService = new RegisterProductInOrdersService(
      productInOrderRepository,
      orderRepository,
      productRepository
    );
  });

  it("should create a new order and register product for an existing user", async () => {
    // Criando um produto ativo no repositório de memória
    const product = await productRepository.register({

      title: "Product Test",
      slug: "product-test",
      imageUrl: "http://example.com/product.jpg",
      description: "Test description",
      priceInCents: 1000,
      stock: 10,
      categoryId: "category123",
      storeId: "store123",
      isActive: true
    });

    // Usando o ID do usuário Clerk direto (sem mock)
    const response = await registerProductInOrdersService.execute({
      customerId: "user_2nGoQ6dlEVeMPTc9bpZCci9uJcK", // ID real vindo do Clerk
      productId: product.id,
      quantity: 2,
    });

    expect(response.productInOrders).toBeTruthy();
    expect(response.error).toBeNull();
  });

  it("should return error if product does not exist", async () => {
    // Tentando registrar um produto inexistente
    const response = await registerProductInOrdersService.execute({
      customerId: "user_2nGoQ6dlEVeMPTc9bpZCci9uJcK", // ID real vindo do Clerk
      productId: "non-existent-product",
      quantity: 1,
    });

    expect(response.productInOrders).toBeNull();
    expect(response.error).toBeInstanceOf(ProductNotFoundError);
  });

  it("should return error if quantity is negative", async () => {
    // Criando um produto ativo
    const product = await productRepository.register({

      title: "Product Test",
      slug: "product-test",
      imageUrl: "http://example.com/product.jpg",
      description: "Test description",
      priceInCents: 1000,
      stock: 10,
      categoryId: "category123",
      storeId: "store123",
      isActive: true
    });

    // Tentando registrar um produto com quantidade negativa
    const response = await registerProductInOrdersService.execute({
      customerId: "user_2nGoQ6dlEVeMPTc9bpZCci9uJcK", // ID real vindo do Clerk
      productId: product.id,
      quantity: -1, // Quantidade inválida
    });

    expect(response.productInOrders).toBeNull();
    expect(response.error).toBeInstanceOf(QuantityIsNegativeError);
  });

  it("should create a new pending order if existing order is not pending", async () => {
    // Criando um produto ativo
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
  
    // Criando um pedido existente com status "shipped"
    await orderRepository.register({
      customerId: "user_2nGoQ6dlEVeMPTc9bpZCci9uJcK", // ID real vindo do Clerk
      fullPriceOrderInCents: 1000,
      status: "shipped", // Status não pendente
      storeId: product.storeId,
    });
  
    // Tentando registrar o produto com pedido não pendente
    const response = await registerProductInOrdersService.execute({
      customerId: "user_2nGoQ6dlEVeMPTc9bpZCci9uJcK", // ID real vindo do Clerk
      productId: product.id,
      quantity: 1,
    });
  
    // Espera-se que uma nova ordem tenha sido criada, então o produto será registrado nela
    expect(response.productInOrders).toBeTruthy();
    expect(response.error).toBeNull();
  });
});
