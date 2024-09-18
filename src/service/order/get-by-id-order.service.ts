import { $Enums, Order } from "@prisma/client";
import { OrderRepository } from "../../repository/order-repository";
import { OrderNotFoundError } from "../error/order-not-found-error";
import { ProductRepostory } from "../../repository/product-repository";

interface GetByIdOrderServiceRequest {
    id: string;
}
interface GetByIdOrderServiceResponse {
    order: Order | null;
    error: Error | null;
}

export class GetByIdOrderService {
    constructor(private orderRepository: OrderRepository) { }

    async execute({ id }: GetByIdOrderServiceRequest): Promise<GetByIdOrderServiceResponse> {
        const order = await this.orderRepository.getById(id);
        if (!order) {
            return { order: null, error: new OrderNotFoundError }
        }
        return { order: order, error: null };
    }
}