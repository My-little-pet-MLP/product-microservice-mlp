import { Cupom, Order } from "@prisma/client";
import { CupomRepository } from "../../repository/cupom-repository";
import { CupomNotFoundError } from "../error/cupom-not-found-error";
import { clearkClientCustomer } from "../../lib/cleark";
import { CustomerNotFoundError } from "../error/customer-not-found-error";
import { ErrorFetchingCustomerError } from "../error/error-fetchig-customer-error";

interface GrantCouponToCustomerByIdServiceRequest {
    customerId: string;
}
interface GrantCouponToCustomerByIdServiceResponse {
    cupom: Cupom | null;
    error: Error | null;
}
export class GrantCouponToCustomerByIdService {
    constructor(private cupomRepository: CupomRepository) { }

    async execute({ customerId }: GrantCouponToCustomerByIdServiceRequest): Promise<GrantCouponToCustomerByIdServiceResponse> {
        try {
            const customerExists = await clearkClientCustomer.users.getUser(customerId);
            if (!customerExists) {
                return { cupom: null, error: new CustomerNotFoundError() };
            }
        } catch (error) {
            return { cupom: null, error: new ErrorFetchingCustomerError() };
        }
        const cupom = await this.cupomRepository.GrantCouponToCustomer(customerId);
        if (!cupom) {
            return { cupom: null, error: new CupomNotFoundError }
        }
        return { cupom, error: null };
    }
}