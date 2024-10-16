import { RegisterProductInOrdersService } from "./register-product-in-orders.service";
import { InMemoryProductInOrderRepository } from "../../repository/in-memory-repository/in-memory-product-in-orders-repository";
import { InMemoryOrderRepository } from "../../repository/in-memory-repository/in-memory-order-repository";
import { InMemoryProductRepository } from "../../repository/in-memory-repository/in-memory-product-repository";
import { CustomerNotFoundError } from "../error/customer-not-found-error";
import { ProductNotFoundError } from "../error/product-not-found-error";
import { QuantityIsNegativeError } from "../error/quantity-is-negative-error";

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

  it("should return error if product is not found", async () => {
    const response = await registerProductInOrdersService.execute({
      customerId: "user_2nU1lHvr8adJLWWhPURNmxP2YDV",
      productId: "non_existent_product",
      quantity: 1,
    });

    expect(response.productInOrders).toBeNull();
    expect(response.error).toBeInstanceOf(ProductNotFoundError);
  });

  it("should return error if quantity is negative", async () => {
    const product = await productRepository.register(
      {
        title: "Product 1",
        slug: "product-1",
        imageUrl: "http://example.com/product1.jpg",
        description: "Description of product 1",
        priceInCents: 1000,
        stock: 10,
        categoryId: "category1",
        storeId: "store123",
        isActive: true,
      },
      "product1"
    );

    const response = await registerProductInOrdersService.execute({
      customerId: "user_2nU1lHvr8adJLWWhPURNmxP2YDV",
      productId: product.id,
      quantity: -1,
    });

    expect(response.productInOrders).toBeNull();
    expect(response.error).toBeInstanceOf(QuantityIsNegativeError);
  });

  it("should create a new order and add product if no pending order exists", async () => {
    const product = await productRepository.register(
      {
        title: "Product 1",
        slug: "product-1",
        imageUrl: "http://example.com/product1.jpg",
        description: "Description of product 1",
        priceInCents: 1000,
        stock: 10,
        categoryId: "category1",
        storeId: "store123",
        isActive: true,
      },
      "product1"
    );

    const response = await registerProductInOrdersService.execute({
      customerId: "user_2nU1lHvr8adJLWWhPURNmxP2YDV",
      productId: product.id,
      quantity: 2,
    });

    expect(response.productInOrders).toBeTruthy();
    expect(response.productInOrders?.quantity).toBe(2);
    expect(response.error).toBeNull();

    const order = await orderRepository.verifyCustomerHavePedingOrder(
      "user_2nU1lHvr8adJLWWhPURNmxP2YDV",
      product.storeId
    );
    expect(order?.fullPriceOrderInCents).toBe(2000); // 2 * 1000
  });


  it("should update product quantity if product already exists in pending order", async () => {
    const product = await productRepository.register(
        {
            title: "Product 1",
            slug: "product-1",
            imageUrl: "http://example.com/product1.jpg",
            description: "Description of product 1",
            priceInCents: 1000,
            stock: 10,
            categoryId: "category1",
            storeId: "store123",
            isActive: true,
        },
        "product1"
    );

    const order = await orderRepository.register({
        customerId: "user_2nU1lHvr8adJLWWhPURNmxP2YDV",
        fullPriceOrderInCents: 0,
        status: "pending",
        storeId: "store123",
    });
    console.log(order)
    await productInOrderRepository.register({
        orderId: order.id,
        productId: product.id,
        quantity: 1,
    });

    // Verifica a quantidade inicial
    const initialProductInOrder = await productInOrderRepository.getByOrderAndProductId(
      order.id,
      product.id
  );
  expect(initialProductInOrder?.quantity).toBe(1); // Verifica o estado inicial
  

    const response = await registerProductInOrdersService.execute({
        customerId: "user_2nU1lHvr8adJLWWhPURNmxP2YDV",
        productId: product.id,
        quantity: 2,
    });

    expect(response.productInOrders).toBeTruthy();
    expect(response.productInOrders?.quantity).toBe(3); // 1 + 2
    expect(response.error).toBeNull();

    const updatedOrder = await orderRepository.getById(order.id);
    expect(updatedOrder?.fullPriceOrderInCents).toBe(3000); // 3 * 1000
});

  it("should calculate the correct full price for an order", async () => {
    const product1 = await productRepository.register(
      {
        title: "Product 1",
        slug: "product-1",
        imageUrl: "http://example.com/product1.jpg",
        description: "Description of product 1",
        priceInCents: 1000,
        stock: 10,
        categoryId: "category1",
        storeId: "store123",
        isActive: true,
      },
      "product1"
    );

    const product2 = await productRepository.register(
      {
        title: "Product 2",
        slug: "product-2",
        imageUrl: "http://example.com/product2.jpg",
        description: "Description of product 2",
        priceInCents: 2000,
        stock: 5,
        categoryId: "category2",
        storeId: "store123",
        isActive: true,
      },
      "product2"
    );

    const order = await orderRepository.register({
      customerId: "user_2nU1lHvr8adJLWWhPURNmxP2YDV",
      fullPriceOrderInCents: 0,
      status: "pending",
      storeId: "store123",
    });

    await productInOrderRepository.register({
      orderId: order.id,
      productId: product1.id,
      quantity: 2, // 2 * 1000 = 2000
    });

    await productInOrderRepository.register({
      orderId: order.id,
      productId: product2.id,
      quantity: 3, // 3 * 2000 = 6000
    });

    const fullPrice = await registerProductInOrdersService["calculateFullPrice"](order.id);
    expect(fullPrice).toBe(8000); // 2000 + 6000 = 8000
  });
});
