import { ProductInOrders } from "@prisma/client";
import { ProductInOrderRepository } from "../../repository/product-in-order-repository";
import { QuantityIsNegativeError } from "../error/quantity-is-negative-error";
import { ProductNotFoundError } from "../error/product-not-found-error";
import { OrderNotFoundError } from "../error/order-not-found-error";
import { OrderRepository } from "../../repository/order-repository";
import { ProductRepostory } from "../../repository/product-repository";

interface UpdateProductInOrdersServiceRequest {
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
}
interface UpdateProductInOrdersServiceResponse {
    productInOrders: ProductInOrders | null;
    error: Error | null;
}

export class UpdateProductInOrdersService {
    constructor(private productInOrdersRepository: ProductInOrderRepository, private orderRepository: OrderRepository, private productRepository: ProductRepostory) { }
    async execute({ id, orderId, productId, quantity }: UpdateProductInOrdersServiceRequest): Promise<UpdateProductInOrdersServiceResponse> {

        const orderExists = await this.orderRepository.getById(orderId);
        if (!orderExists) {
            return { productInOrders: null, error: new OrderNotFoundError }
        }

        const productExists = await this.productRepository.getById(productId);
        if (!productExists) {
            return { productInOrders: null, error: new ProductNotFoundError };
        }
        if (quantity < 0) {
            return { productInOrders: null, error: new QuantityIsNegativeError };
        }
        const productInOrders = await this.productInOrdersRepository.update(id, { orderId, productId, quantity });

        return { productInOrders, error: null }
    }
}