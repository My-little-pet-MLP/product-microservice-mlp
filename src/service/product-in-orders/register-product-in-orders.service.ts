import { ProductInOrders } from "@prisma/client";
import { ProductInOrderRepository } from "../../repository/product-in-order-repository";
import { OrderRepository } from "../../repository/order-repository";
import { ProductRepostory } from "../../repository/product-repository";
import { OrderNotFoundError } from "../error/order-not-found-error";
import { ProductNotFoundError } from "../error/product-not-found-error";
import { QuantityIsNegativeError } from "../error/quantity-is-negative-error";
import { OrderIsNotPedingError } from "../error/order-is-not-peding-error";

interface RegisterProductInOrdersServiceRequest {
    orderId: string;
    productId: string;
    quantity: number;
}
interface RegisterProductInOrdersServiceResponse {
    productInOrders: ProductInOrders | null;
    error: Error | null;
}

export class RegisterProductInOrdersService {
    constructor(private productInOrdersRepository: ProductInOrderRepository, private orderRepository: OrderRepository, private productRepository: ProductRepostory) { }
    async execute({ orderId, productId, quantity }: RegisterProductInOrdersServiceRequest): Promise<RegisterProductInOrdersServiceResponse> {

        const orderExists = await this.orderRepository.getById(orderId);
        if (!orderExists) {
            return { productInOrders: null, error: new OrderNotFoundError }
        }
        if (orderExists.status != "pending") {
            return { productInOrders: null, error: new OrderIsNotPedingError };
        }
        const productExists = await this.productRepository.getById(productId);
        if (!productExists) {
            return { productInOrders: null, error: new ProductNotFoundError };
        }
        if (productExists.isActive == false) {
            return { productInOrders: null, error: new ProductNotFoundError };
        }
        if (quantity < 0) {
            return { productInOrders: null, error: new QuantityIsNegativeError };
        }

        const productInOrders = await this.productInOrdersRepository.register({ orderId, productId, quantity });

        return { productInOrders, error: null }
    }
}