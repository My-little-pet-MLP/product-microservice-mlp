import { ProductInOrders } from "@prisma/client";
import { ProductInOrderRepository } from "../../repository/product-in-order-repository";
import { OrderRepository } from "../../repository/order-repository";
import { StoreNotFoundError } from "../error/store-not-found-error";
import { OrderNotFoundError } from "../error/order-not-found-error";

interface ListAllByOrderIdServiceRequest {
    orderId: string;
}
interface ListAllByOrderIdServiceResponse {
    productsInOrders: ProductInOrders[] | null;
    error: Error | null;
}

export class ListAllProductsInOrdersByOrderId {
    constructor(private productInOrdersRepository: ProductInOrderRepository, private orderRepository: OrderRepository) { }

    async execute({ orderId }: ListAllByOrderIdServiceRequest): Promise<ListAllByOrderIdServiceResponse> {
        const orderExists = await this.orderRepository.getById(orderId);
        if (!orderExists) {
            return { productsInOrders: null, error: new OrderNotFoundError }
        }
        const productsInOrders = await this.productInOrdersRepository.listAllByOrder(orderId);
        return { productsInOrders, error: null }
    }
}