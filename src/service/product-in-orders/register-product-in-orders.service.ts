import { ProductInOrders } from "@prisma/client";
import { ProductInOrderRepository } from "../../repository/product-in-order-repository";
import { OrderRepository } from "../../repository/order-repository";
import { ProductRepostory } from "../../repository/product-repository";
import { OrderNotFoundError } from "../error/order-not-found-error";
import { ProductNotFoundError } from "../error/product-not-found-error";
import { QuantityIsNegativeError } from "../error/quantity-is-negative-error";
import { OrderIsNotPedingError } from "../error/order-is-not-peding-error";
import { clearkClientCustomer } from "../../lib/cleark";

interface RegisterProductInOrdersServiceRequest {
    customerId: string;
    productId: string;
    quantity: number;
}

interface RegisterProductInOrdersServiceResponse {
    productInOrders: ProductInOrders | null;
    error: Error | null;
}

export class RegisterProductInOrdersService {
    constructor(
        private productInOrdersRepository: ProductInOrderRepository,
        private orderRepository: OrderRepository,
        private productRepository: ProductRepostory
    ) { }

    async execute({ productId, quantity, customerId }: RegisterProductInOrdersServiceRequest): Promise<RegisterProductInOrdersServiceResponse> {
        // Verifica se o cliente existe
        try {
            const customerExists = await clearkClientCustomer.users.getUser(customerId);
            if (!customerExists) {
                return { productInOrders: null, error: new Error("Customer not found") };
            }
        } catch (error) {
            return { productInOrders: null, error: new Error("Error fetching customer") };
        }

        // Verifica se o produto existe e está ativo
        const productExists = await this.productRepository.getById(productId);
        if (!productExists || !productExists.isActive) {
            return { productInOrders: null, error: new ProductNotFoundError() };
        }

        // Verifica se a quantidade é válida
        if (quantity < 0) {
            return { productInOrders: null, error: new QuantityIsNegativeError() };
        }

        // Verifica se o cliente tem um pedido pendente na mesma loja
        const existingOrder = await this.orderRepository.verifyCustomerHavePedingOrder(customerId, productExists.storeId);

        let orderId: string;
        if (!existingOrder) {
            // Cria novo pedido se não houver nenhum pendente
            const newOrder = await this.orderRepository.register({
                customerId,
                fullPriceOrderInCents: productExists.priceInCents * quantity,
                status: "pending",
                storeId: productExists.storeId
            });
            orderId = newOrder.id;
        } else {
            // Se já houver um pedido pendente, verifica o status
            if (existingOrder.status !== "pending") {
                return { productInOrders: null, error: new OrderIsNotPedingError() };
            }
            orderId = existingOrder.id;
        }

        // Registra o produto no pedido
        const productInOrders = await this.productInOrdersRepository.register({
            orderId,
            productId,
            quantity
        });

        return { productInOrders, error: null };
    }
}
