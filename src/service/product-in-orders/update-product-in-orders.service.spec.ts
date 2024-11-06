
import { InMemoryProductInOrderRepository } from "../../repository/in-memory-repository/in-memory-product-in-orders-repository";
import { InMemoryOrderRepository } from "../../repository/in-memory-repository/in-memory-order-repository";
import { InMemoryProductRepository } from "../../repository/in-memory-repository/in-memory-product-repository";
import { ProductInOrdersNotFoundError } from "../error/product-in-orders-not-found-error";
import { QuantityIsNegativeError } from "../error/quantity-is-negative-error";
import { UpdateProductInOrdersService } from "./update-product-in-orders.service";

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

  it("should successfully update product quantity and recalculate order total", async () => {
    // Criando uma ordem e produtos
    const order = await orderRepository.register({
      storeId: "store123",
      customerId: "customer123",
      fullPriceOrderInCents: 0,
      status: "pending"
    });

    const product = await productRepository.register({
      title: "Produto Teste",
      imageUrl: "https://example.com/produto.jpg",
      priceInCents: 1000, // 10 reais
      stock: 10,
      categoryId: "category123",
      storeId: "store123",
      slug: "",
      description: "descrição",
      isActive: true
    });

    const productInOrder = await productInOrderRepository.register({
      orderId: order.id,
      productId: product.id,
      quantity: 1
    });

    // Executando o serviço para atualizar a quantidade
    const response = await updateProductInOrdersService.execute({ id: productInOrder.id, quantity: 3 });

    // Verificando se a quantidade foi atualizada corretamente
    expect(response.productInOrders?.quantity).toBe(3);
    expect(response.error).toBeNull();

    // Verificando se o preço total da ordem foi recalculado corretamente
    const updatedOrder = await orderRepository.getById(order.id);
    expect(updatedOrder?.fullPriceOrderInCents).toBe(3000); // 1000 * 3
  });

  it("should return an error if product in order does not exist", async () => {
    const response = await updateProductInOrdersService.execute({ id: "non-existing-id", quantity: 2 });

    expect(response.productInOrders).toBeNull();
    expect(response.error).toBeInstanceOf(ProductInOrdersNotFoundError);
  });

  it("should return an error if quantity is negative", async () => {
    // Criando uma ordem e produto no pedido
    const order = await orderRepository.register({
      storeId: "store123",
      customerId: "customer123",
      fullPriceOrderInCents: 0,
      status: "pending"
    });

    const product = await productRepository.register({
      title: "Produto Teste",
      imageUrl: "https://example.com/produto.jpg",
      priceInCents: 1000,
      stock: 10,
      categoryId: "category123",
      storeId: "store123",
      slug: "",
      description: "descrição",
      isActive: true
    });

    const productInOrder = await productInOrderRepository.register({
      orderId: order.id,
      productId: product.id,
      quantity: 1
    });

    // Tentando atualizar com quantidade negativa
    const response = await updateProductInOrdersService.execute({ id: productInOrder.id, quantity: -1 });

    expect(response.productInOrders).toBeNull();
    expect(response.error).toBeInstanceOf(QuantityIsNegativeError);
  });
});
