import { Order } from "@prisma/client";
import { OrderRepository } from "../../repository/order-repository";
import { StoreRepository } from "../../repository/store-repository";
import { StoreNotFoundError } from "../error/store-not-found-error";

interface RegisterOrderServiceRequest {
    customerId: string;
    customerIdStripe: string;
    storeId: string;
}
interface RegisterOrderServiceResponse {
    order: Order | null;
    error: Error | null;
}

export class RegisterOrderService {
    constructor(private orderRepository: OrderRepository, private storeRepository: StoreRepository) { }

    async execute({ customerId, customerIdStripe, storeId }: RegisterOrderServiceRequest): Promise<RegisterOrderServiceResponse> {

        const storeExists = await this.storeRepository.findById(storeId);
        if (!storeExists) {
            return { order: null, error: new StoreNotFoundError }
        }
        const order = await this.orderRepository.register({
            customerId: customerId,
            customerIdStripe: customerIdStripe,
            fullPriceOrderInCents: 0,
            storeId,
            status: "pending"
        })
        return { order, error: null }
    }
}