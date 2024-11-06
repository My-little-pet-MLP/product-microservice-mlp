import { ProductInOrderRepository } from "../../repository/product-in-order-repository";
import { OrderRepository } from "../../repository/order-repository";
import { ProductRepostory } from "../../repository/product-repository";
import { OrderNotFoundError } from "../error/order-not-found-error";
import { ProductInOrdersNotFoundError } from "../error/product-in-orders-not-found-error";
import { ProductNotFoundError } from "../error/product-not-found-error";

interface ListAllByOrderIdServiceRequest {
    orderId: string;
}

interface ProductDetail {
    id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    productInOrderId: string;
}

interface ListAllByOrderIdServiceResponse {
    products: ProductDetail[] | null;
    error: Error | null;
}

export class ListAllProductsInOrdersByOrderId {
    constructor(
        private productInOrdersRepository: ProductInOrderRepository,
        private orderRepository: OrderRepository,
        private productRepository: ProductRepostory
    ) {}

    async execute({ orderId }: ListAllByOrderIdServiceRequest): Promise<ListAllByOrderIdServiceResponse> {
        console.log(`Iniciando execução para orderId: ${orderId}`);

        const orderExists = await this.orderRepository.getById(orderId);
        console.log(`Pedido encontrado: ${!!orderExists}`);

        if (!orderExists) {
            console.error(`Erro: Pedido com ID ${orderId} não encontrado.`);
            return { products: null, error: new OrderNotFoundError() };
        }

        const productsInOrders = await this.productInOrdersRepository.listAllByOrder(orderId);
        console.log(`Produtos encontrados no pedido: ${productsInOrders?.length}`);

        if (!productsInOrders || productsInOrders.length === 0) {
            console.error(`Erro: Nenhum produto encontrado para o pedido ${orderId}.`);
            return { products: null, error: new ProductInOrdersNotFoundError() };
        }

        const productDetails: ProductDetail[] = await Promise.all(
            productsInOrders.map(async (productInOrder) => {
                console.log(`Buscando produto com ID: ${productInOrder.productId}`);

                const product = await this.productRepository.getById(productInOrder.productId);

                if (!product) {
                    console.error(`Erro: Produto com ID ${productInOrder.productId} não encontrado.`);
                    throw new ProductNotFoundError();
                }

                console.log(`Produto encontrado: ${product.title}, Quantidade: ${productInOrder.quantity}`);

                return {
                    id: product.id,
                    name: product.title,
                    image: product.imageUrl,
                    price: product.priceInCents * productInOrder.quantity,
                    quantity: productInOrder.quantity,
                    productInOrderId: productInOrder.id // Corrigido para usar o ID de ProductInOrder
                };
            })
        );

        console.log(`Execução concluída com sucesso para orderId: ${orderId}`);
        return { products: productDetails, error: null };
    }
}
