import { Order } from "@prisma/client";
import { CupomRepository } from "../../repository/cupom-repository";
import { OrderRepository } from "../../repository/order-repository";
import { OrderNotFoundError } from "../error/order-not-found-error";
import { CupomNotFoundError } from "../error/cupom-not-found-error";

interface ApplyCupomInOrderServiceRequest {
    cupomId: string;
    orderId: string;
}
interface ApplyCupomInOrderServiceResponse {
    order: Order | null;
    error: Error | null;
}

export class ApplyCupomInOrderService {
    constructor(private cupomRepository: CupomRepository, private orderRepository: OrderRepository) { }

    async execute({ cupomId, orderId }: ApplyCupomInOrderServiceRequest): Promise<ApplyCupomInOrderServiceResponse> {
        const OrderExists = await this.orderRepository.getById(orderId);
        if (!OrderExists) {
            return { order: null, error: new OrderNotFoundError }
        }
        const CupomExists = await this.cupomRepository.getById(cupomId);
        if (!CupomExists) {
            return { order: null, error: new CupomNotFoundError }
        }
        const orderUpdated = await this.orderRepository.update(orderId, {
            cupomId,
        })
        return { order: orderUpdated, error: null }
    }
}