import { ListAllProductsInOrdersByOrderId } from "./list-all-by-order-id.service";
import { InMemoryProductInOrderRepository } from "../../repository/in-memory-repository/in-memory-product-in-orders-repository";
import { InMemoryOrderRepository } from "../../repository/in-memory-repository/in-memory-order-repository";
import { InMemoryProductRepository } from "../../repository/in-memory-repository/in-memory-product-repository";
import { OrderNotFoundError } from "../error/order-not-found-error";

describe("ListAllProductsInOrdersByOrderId", () => {
  let productInOrderRepository: InMemoryProductInOrderRepository;
  let orderRepository: InMemoryOrderRepository;
  let productRepository: InMemoryProductRepository;
  let listAllProductsInOrdersByOrderIdService: ListAllProductsInOrdersByOrderId;

  beforeEach(() => {
    productInOrderRepository = new InMemoryProductInOrderRepository();
    orderRepository = new InMemoryOrderRepository();
    productRepository = new InMemoryProductRepository();
    listAllProductsInOrdersByOrderIdService = new ListAllProductsInOrdersByOrderId(
      productInOrderRepository,
      orderRepository,
      productRepository
    );
  });

  it("should return products in order if order exists", async () => {
    // Registrando uma ordem no repositório in-memory
    const order = await orderRepository.register({
      storeId: "store123",
      customerId: "customer123",
      fullPriceOrderInCents: 1000,
      status: "pending"
    });
  
    // Registrando produtos e capturando os IDs gerados
    const product1 = await productRepository.register({
      title: "Produto 1",
      imageUrl: "https://example.com/produto1.jpg",
      priceInCents: 500,
      stock: 10,
      categoryId: "category123",
      storeId: "store123",
      slug: "",
      description: "eqweqwe",
      isActive: true
    });
  
    const product2 = await productRepository.register({
      title: "Produto 2",
      imageUrl: "https://example.com/produto2.jpg",
      priceInCents: 200,
      stock: 5,
      categoryId: "category123",
      storeId: "store123",
      slug: "",
      description: "qweqweqew",
      isActive: true
    });
  
    // Associando produtos à ordem usando os IDs gerados
    const productInOrder1 = await productInOrderRepository.register({
      orderId: order.id,
      productId: product1.id,
      quantity: 2
    });
  
    const productInOrder2 = await productInOrderRepository.register({
      orderId: order.id,
      productId: product2.id,
      quantity: 1
    });
  
    // Executando o serviço para listar todos os produtos da ordem
    const response = await listAllProductsInOrdersByOrderIdService.execute({ orderId: order.id });
  
    // Verificando se os produtos foram retornados corretamente
    expect(response.products).toHaveLength(2);
    expect(response.error).toBeNull();
    expect(response.products).toEqual([
      {
        id: product1.id,
        name: "Produto 1",
        image: "https://example.com/produto1.jpg",
        price: 1000, // 500 * 2
        quantity: 2,
        productInOrderId: productInOrder1.id, // Usando productInOrder1.id
      },
      {
        id: product2.id,
        name: "Produto 2",
        image: "https://example.com/produto2.jpg",
        price: 200,
        quantity: 1,
        productInOrderId: productInOrder2.id, // Usando productInOrder2.id
      }
    ]);
  });

  it("should return an error if order does not exist", async () => {
    const response = await listAllProductsInOrdersByOrderIdService.execute({ orderId: "non-existing-order" });

    expect(response.products).toBeNull();
    expect(response.error).toBeInstanceOf(OrderNotFoundError);
  });
});
