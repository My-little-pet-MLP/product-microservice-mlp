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

        // Atualiza apenas a quantidade do produto no pedido, não o preço do produto
        const productInOrders = await this.productInOrdersRepository.update(id, quantity);

        // Busca todos os produtos na ordem para calcular o preço total atualizado da ordem
        const allProductsInOrders = await this.productInOrdersRepository.listAllByOrder(productInOrderExists.orderId) || [];
        
        // Calcula o preço total da ordem somando (preço do produto * quantidade do item no pedido)
        let fullPriceOrderInCents = 0;

        for (const item of allProductsInOrders) {
            // Obtém o produto associado, mas não modifica seu preço
            const product = await this.productRepository.getById(item.productId);
            if (product) {
                // Usa apenas o preço para calcular o total, sem alterar o próprio produto
                fullPriceOrderInCents += product.priceInCents * item.quantity;
            }
        }

        // Atualiza apenas o preço total do pedido, sem modificar o preço do produto no repositório de produtos
        await this.orderRepository.update(productInOrderExists.orderId, {
            fullPriceOrderInCents
        });

        return { productInOrders, error: null };
    }
}