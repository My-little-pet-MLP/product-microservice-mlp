import { Missao } from "@prisma/client";
import { MissionsRepository } from "../../repository/missions-repository";
import { clearkClientCustomer } from "../../lib/cleark";
import { CustomerNotFoundError } from "../error/customer-not-found-error";
import { ErrorFetchingCustomerError } from "../error/error-fetchig-customer-error";

interface ListAllByCustomerIdUncompleteByDateServiceRequest {
    customerId: string;
}
interface ListAllByCustomerIdUncompleteByDateServiceResponse {
    missions: Missao[] | null;
    error: Error | null;
}
export class ListAllByCustomerIdUncompleteByDateService {
    constructor(private missionRepository: MissionsRepository) { }

    async execute({ customerId }: ListAllByCustomerIdUncompleteByDateServiceRequest): Promise<ListAllByCustomerIdUncompleteByDateServiceResponse> {
        const missions = await this.missionRepository.listAllByCustomerIdUncomplete(customerId);
        try {
            const customerExists = await clearkClientCustomer.users.getUser(customerId);
            if (!customerExists) {
                return { missions: null, error: new CustomerNotFoundError() };
            }
        } catch (error) {
            return { missions: null, error: new ErrorFetchingCustomerError() };
        }
        return { missions, error: null }
    }
}