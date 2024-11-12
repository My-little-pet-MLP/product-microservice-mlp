import { ProductInOrders } from "@prisma/client";
import { ProductInOrderRepository } from "../../repository/product-in-order-repository";
import { QuantityIsNegativeError } from "../error/quantity-is-negative-error";
import { OrderRepository } from "../../repository/order-repository";
import { ProductInOrdersNotFoundError } from "../error/product-in-orders-not-found-error";
import { ProductRepostory } from "../../repository/product-repository"; // Corrigido para ProductRepository

interface UpdateProductInOrdersServiceRequest {
    id: string;
    quantity: number;
}

interface UpdateProductInOrdersServiceResponse {
    productInOrders: ProductInOrders | null;
    error: Error | null;
}

export class UpdateProductInOrdersService {
    constructor(
        private productInOrdersRepository: ProductInOrderRepository,
        private orderRepository: OrderRepository,
        private productRepository: ProductRepostory
    ) { }

    async execute({ id, quantity }: UpdateProductInOrdersServiceRequest): Promise<UpdateProductInOrdersServiceResponse> {
        // Verifica se o produto no pedido existe
        const productInOrderExists = await this.productInOrdersRepository.findById(id);
        if (!productInOrderExists) {
            return { productInOrders: null, error: new ProductInOrdersNotFoundError() };
        }

        // Verifica se a quantidade é válida
        if (quantity < 0) {
            return { productInOrders: null, error: new QuantityIsNegativeError() };
        }

        // Se a quantidade for 0, exclui o produto do pedido
        if (quantity === 0) {
            await this.productInOrdersRepository.delete(id);

            // Verifica se ainda há produtos no pedido após a exclusão
            const remainingProductsInOrder = await this.productInOrdersRepository.listAllByOrder(productInOrderExists.orderId) ?? [];

            if (remainingProductsInOrder.length === 0) {
                // Se não houver mais produtos, deleta o pedido
                await this.orderRepository.delete(productInOrderExists.orderId);

                // Retorna null para `productInOrders` e `error` pois ambos foram deletados
                return { productInOrders: null, error: null };
            }


            // Caso contrário, recalcula o preço total da ordem sem o produto deletado
            let fullPriceOrderInCents = 0;
            for (const item of remainingProductsInOrder) {
                const product = await this.productRepository.getById(item.productId);
                if (product) {
                    fullPriceOrderInCents += product.priceInCents * item.quantity;
                }
            }

            await this.orderRepository.update(productInOrderExists.orderId, {
                fullPriceOrderInCents
            });

            return { productInOrders: null, error: null };
        }

        // Atualiza apenas a quantidade do produto no pedido
        const productInOrders = await this.productInOrdersRepository.update(id, quantity);

        // Recalcula o preço total da ordem
        const allProductsInOrders = await this.productInOrdersRepository.listAllByOrder(productInOrderExists.orderId) || [];
        let fullPriceOrderInCents = 0;

        for (const item of allProductsInOrders) {
            const product = await this.productRepository.getById(item.productId);
            if (product) {
                fullPriceOrderInCents += product.priceInCents * item.quantity;
            }
        }

        await this.orderRepository.update(productInOrderExists.orderId, {
            fullPriceOrderInCents
        });

        return { productInOrders, error: null };
    }
}
