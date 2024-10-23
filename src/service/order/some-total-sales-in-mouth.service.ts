import { OrderRepository } from "../../repository/order-repository";
import { StoreRepository } from "../../repository/store-repository";
import { StoreNotFoundError } from "../error/store-not-found-error";

interface TotalSalesInMonthSomeRequest {
    storeId: string;
}
interface TotalSalesInMonthSomeResponse {
    totalSalesInMonth: number | null;
    error: Error | null;
}
export class TotalSalesInMonthSomeService {
    constructor(private storeRepository: StoreRepository, private orderRepository: OrderRepository) { }

    async execute({ storeId }: TotalSalesInMonthSomeRequest): Promise<TotalSalesInMonthSomeResponse> {
        const storeExists = await this.storeRepository.findById(storeId);
        if (!storeExists) {
            return {
                totalSalesInMonth: null, error: new StoreNotFoundError()
            }
        }
        const totalSalesInMonth = await this.orderRepository.TotalSalesInMonthCount(storeId);
        return { totalSalesInMonth, error: null };
    }
}