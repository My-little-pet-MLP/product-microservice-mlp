import { Order } from "@prisma/client"
import { OrderRepository } from "../../repository/order-repository";
import { StoreRepository } from "../../repository/store-repository";
import { StoreNotFoundError } from "../error/store-not-found-error";

interface ListAllOrdersByStoreIdServiceRequest {
    storeId: string
    page: number
    size: number
}
interface ListAllOrdersByStoreIdServiceResponse {
    orders: Order[] | null;
    error: Error | null;
}
export class ListAllOrdersByStoreIdService {
    constructor(private orderRepository: OrderRepository, private storeRepository: StoreRepository) { }
    async execute({ storeId, page, size }: ListAllOrdersByStoreIdServiceRequest): Promise<ListAllOrdersByStoreIdServiceResponse> {
        const storeExists = await this.storeRepository.findById(storeId);
        if (!storeExists) {
            return { orders: null, error: new StoreNotFoundError }
        }
        const orders = await this.orderRepository.listAllByStoreId(storeId, page, size)
        return { orders, error: null }
    }
}