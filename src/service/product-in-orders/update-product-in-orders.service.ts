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
    ) {}

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
            
            // Após deletar o item, recalcula o preço total da ordem sem ele
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

            // Retorna null para `productInOrders` pois ele foi deletado
            return { productInOrders: null, error: null };
        }

        // Atualiza apenas a quantidade do produto no pedido, não o preço do produto
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
