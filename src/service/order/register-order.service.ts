import { Order } from "@prisma/client";
import { OrderRepository } from "../../repository/order-repository";
import { StoreRepository } from "../../repository/store-repository";
import { StoreNotFoundError } from "../error/store-not-found-error";

interface RegisterOrderServiceRequest {
    storeId: string
    customerId: string
    customerIdStripe: string;
}
interface RegisterOrderServiceResponse {
    order: Order | null;
    error: Error | null;
}

export class RegisterOrderService {
    constructor(private orderRepository: OrderRepository, private storeRepository: StoreRepository) { }

    async execute({ storeId, customerId, customerIdStripe }: RegisterOrderServiceRequest): Promise<RegisterOrderServiceResponse> {

        const storeExists = await this.storeRepository.findById(storeId);
        if (!storeExists) {
            return { order: null, error: new StoreNotFoundError }
        }

        const orderRegister = await this.orderRepository.register({
            storeId,
            status: "pending",
            customerId,
            customerIdStripe,
            fullPriceOrderInCents: 0,

        })
        return { order: orderRegister, error: null };
    }
}