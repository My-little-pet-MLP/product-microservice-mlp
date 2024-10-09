import { Order } from "@prisma/client";
import { OrderRepository } from "../../repository/order-repository";
import { ProductInOrderRepository } from "../../repository/product-in-order-repository";
import { ProductRepostory } from "../../repository/product-repository";
import { OrderNotFoundError } from "../error/order-not-found-error";
import { ProductNotFoundError } from "../error/product-not-found-error";
import { InsufficientStockError } from "../error/insufficient-stock-error";
import { OrderDoesNotHaveProductInOrderRegisted } from "../error/order-does-not-have-productinorder-registed";

interface ConfirmOrderServiceRequest {
    id: string;
}
interface ConfirmOrderServiceResponse {
    order: Order | null;
    error: Error | null;
}

export class ConfirmOrderService {
    constructor(private orderRepository: OrderRepository, private productRepository: ProductRepostory, private productInOrderRepository: ProductInOrderRepository) { }
    async execute({ id }: ConfirmOrderServiceRequest): Promise<ConfirmOrderServiceResponse> {
        const OrderExists = await this.orderRepository.getById(id);
        if (!OrderExists) {
            return { order: null, error: new OrderNotFoundError }
        }
        const productInOrders = await this.productInOrderRepository.listAllByOrder(OrderExists.id);
        if (!productInOrders || productInOrders.length === 0) {
            return { order: null, error: new OrderDoesNotHaveProductInOrderRegisted};
        }
        let fullPriceOrderInCents = 0;
        for (const productInOrder of productInOrders) {
            // Buscar o produto
            const product = await this.productRepository.getById(productInOrder.productId);
            if (!product) {
                return { order: null, error: new ProductNotFoundError };
            }
            // Verificar se há estoque suficiente
            if (product.stock < productInOrder.quantity) {
                return { order: null, error: new InsufficientStockError };
            }

            // Atualizar o estoque do produto
            product.stock -= productInOrder.quantity;
            await this.productRepository.updateStock(product.id, product.stock);

            // Somar o preço total para o pedido
            fullPriceOrderInCents += product.priceInCents * productInOrder.quantity;
        }
        const order = await this.orderRepository.confirmOrder(id, fullPriceOrderInCents)
        // Retornar a ordem com erro nulo após o processamento bem-sucedido
        return { order, error: null };
    }
}