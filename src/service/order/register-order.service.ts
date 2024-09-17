import { Order } from "@prisma/client";
import { OrderRepository } from "../../repository/order-repository";

interface RegisterOrderServiceRequest {
    customerId: string;
    customerIdStripe: string;
}
interface RegisterOrderServiceResponse {
    order: Order | null;
    error: Error | null;
}

export class RegisterOrderService {
    constructor(private orderRepository: OrderRepository) { }

    async execute({ customerId, customerIdStripe }: RegisterOrderServiceRequest): Promise<RegisterOrderServiceResponse> {
        const order = await this.orderRepository.register({
            customerId: customerId,
            customerIdStripe: customerIdStripe,
            fullPriceOrderInCents: 0,
            status: "pending"
        })
        return { order, error: null }
    }
}