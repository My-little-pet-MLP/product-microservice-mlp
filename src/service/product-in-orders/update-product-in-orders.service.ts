import { ProductInOrders } from "@prisma/client";
import { ProductInOrderRepository } from "../../repository/product-in-order-repository";
import { QuantityIsNegativeError } from "../error/quantity-is-negative-error";
import { ProductNotFoundError } from "../error/product-not-found-error";
import { OrderNotFoundError } from "../error/order-not-found-error";
import { OrderRepository } from "../../repository/order-repository";
import { ProductRepostory } from "../../repository/product-repository";
import { clearkClientCustomer } from "../../lib/cleark";
import { OrderIsNotPedingError } from "../error/order-is-not-peding-error";

interface UpdateProductInOrdersServiceRequest {
    id: string;
    customerId: string;
    productId: string;
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

    async execute({ id, customerId, productId, quantity }: UpdateProductInOrdersServiceRequest): Promise<UpdateProductInOrdersServiceResponse> {
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

        // Verifica se o cliente tem um pedido pendente na loja do produto
        const existingOrder = await this.orderRepository.verifyCustomerHavePedingOrder(customerId, productExists.storeId);
        if (!existingOrder) {
            return { productInOrders: null, error: new OrderNotFoundError() };
        }

        // Verifica se o status do pedido é "pending"
        if (existingOrder.status !== "pending") {
            return { productInOrders: null, error: new OrderIsNotPedingError() };
        }

        // Atualiza o produto no pedido
        const productInOrders = await this.productInOrdersRepository.update(id, {
            productId,
            quantity
        });

        return { productInOrders, error: null };
    }
}
