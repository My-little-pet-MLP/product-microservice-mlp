import { OrderRepository } from "../../repository/order-repository";
import { StoreRepository } from "../../repository/store-repository";
import { StoreNotFoundError } from "../error/store-not-found-error";

interface TotalBillingMonthSomeRequest {
    storeId: string;
}
interface TotalBillingMonthSomeResponse {
    total: number | null;
    error: Error | null;
}
export class TotalBillingMonthSomeService {
    constructor(private storeRepository: StoreRepository, private orderRepository: OrderRepository) { }

    async execute({ storeId }: TotalBillingMonthSomeRequest): Promise<TotalBillingMonthSomeResponse> {
        const storeExists = await this.storeRepository.findById(storeId);
        if (!storeExists) {
            return {
                total: null, error: new StoreNotFoundError()
            }
        }
        const total = await this.orderRepository.TotalBillingMonthSome(storeId);
        return { total, error: null };
    }
}