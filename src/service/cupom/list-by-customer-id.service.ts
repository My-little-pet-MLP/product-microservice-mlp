import { Cupom } from "@prisma/client";
import { CupomRepository } from "../../repository/cupom-repository";
import { clearkClientCustomer } from "../../lib/cleark";
import { CustomerNotFoundError } from "../error/customer-not-found-error";
import { ErrorFetchingCustomerError } from "../error/error-fetchig-customer-error";
import { StoreRepository } from "../../repository/store-repository";
import { StoreNotFoundError } from "../error/store-not-found-error";

interface ListAllCupomByCustomerIdAndStoreIdServiceRequest {
    customerId: string;
    storeId: string;
}
interface ListAllCupomByCustomerIdAndStoreIdServiceResponse {
    cupons: Cupom[] | null;
    error: Error | null;
}
export class ListAllCupomByCustomerIdAndStoreIdService {
    constructor(private cupomRepository: CupomRepository, private storeRepository: StoreRepository) { }
    async execute({ customerId, storeId }: ListAllCupomByCustomerIdAndStoreIdServiceRequest): Promise<ListAllCupomByCustomerIdAndStoreIdServiceResponse> {
        try {
            const customerExists = await clearkClientCustomer.users.getUser(customerId);
            if (!customerExists) {
                return { cupons: null, error: new CustomerNotFoundError() };
            }
        } catch (error) {
            return { cupons: null, error: new ErrorFetchingCustomerError() };
        }
        const storeExists = await this.storeRepository.findById(storeId);
        if (!storeExists) {
            return { cupons: null, error: new StoreNotFoundError }
        }
        const cupons = await this.cupomRepository.listByStoreIdAndCustomerId(customerId, storeId);
        return { cupons, error: null }
    }
}