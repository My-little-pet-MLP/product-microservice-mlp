import { ProductInOrders } from "@prisma/client";
import { ProductInOrderRepository } from "../../repository/product-in-order-repository";
import { QuantityIsNegativeError } from "../error/quantity-is-negative-error";
import { OrderRepository } from "../../repository/order-repository";
import { ProductInOrdersNotFoundError } from "../error/product-in-orders-not-found-error";
import { ProductRepostory } from "../../repository/product-repository";

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
        private productRepository: ProductRepostory // Adicionei o repositório de produtos para buscar preços
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

        // Atualiza o produto no pedido
        const productInOrders = await this.productInOrdersRepository.update(id, quantity);

        // Busca todos os produtos na ordem para calcular o preço total atualizado
        const allProductsInOrders = await this.productInOrdersRepository.listAllByOrder(productInOrderExists.orderId) || [];
        
        // Calcula o preço total da ordem somando (preço do produto * quantidade)
        let fullPriceOrderInCents = 0;

        for (const item of allProductsInOrders) {
            const product = await this.productRepository.getById(item.productId);
            if (product) {
                fullPriceOrderInCents += product.priceInCents * item.quantity;
            }
        }

        // Atualiza o campo fullPriceOrderInCents na ordem
        await this.orderRepository.update(productInOrderExists.orderId, {
            fullPriceOrderInCents
        });

        return { productInOrders, error: null };
    }
}