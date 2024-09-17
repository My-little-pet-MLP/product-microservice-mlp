import { Order } from "@prisma/client";
import { OrderRepository } from "../../repository/order-repository";

interface ListOrdersByProductIdServiceRequest {
    productId: string;
    page: number;
    size: number;
}
interface ListOrdersByProductIdServiceResponse {
    orders: Order[] | null;
    error: Error | null;
}

export class ListOrdersByProductIdService {
    constructor(private orderRepository: OrderRepository) { }

    async execute({ productId, page, size }: ListOrdersByProductIdServiceRequest): Promise<ListOrdersByProductIdServiceResponse> {
        const orders = await this.orderRepository.listByProductId(productId, size, page);

        return { orders, error: null }
    }
}