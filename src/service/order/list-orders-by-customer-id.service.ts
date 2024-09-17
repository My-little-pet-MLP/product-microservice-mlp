import { Order } from "@prisma/client";
import { OrderRepository } from "../../repository/order-repository";

interface ListOrdersByCustomerIdServiceRequest {
    customerId: string;
    size: number;
    page: number;
}
interface ListOrdersByCustomerIdServiceResponse {
    orders: Order[] | null;
    error: Error | null;
}

export class ListOrdersByCustomerIdService {
    constructor(private orderRepository: OrderRepository) { }

    async execute({ customerId, size, page }: ListOrdersByCustomerIdServiceRequest): Promise<ListOrdersByCustomerIdServiceResponse> {
        const orders = await this.orderRepository.listByCustomerId(customerId, size, page);

        return { orders, error: null }
    }
}