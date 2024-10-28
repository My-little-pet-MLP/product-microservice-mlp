import { Pet } from "@prisma/client";
import { PetRepository } from "../../repository/pet-repository";
import { clearkClientCustomer } from "../../lib/cleark";
import { CustomerNotFoundError } from "../error/customer-not-found-error";
import { ErrorFetchingCustomerError } from "../error/error-fetchig-customer-error";

interface ListAllByCustomerIdServiceRequest {
    customerId: string;
}
interface ListAllByCustomerIdServiceResponse {
    pets: Pet[] | null;
    error: Error | null;
}
export class ListAllByCustomerIdService {
    constructor(private petRepository: PetRepository) { }

    async execute({ customerId }: ListAllByCustomerIdServiceRequest): Promise<ListAllByCustomerIdServiceResponse> {
        try {
            const customerExists = await clearkClientCustomer.users.getUser(customerId);
            if (!customerExists) {
                return { pets: null, error: new CustomerNotFoundError() };
            }
        } catch (error) {
            return { pets: null, error: new ErrorFetchingCustomerError() };
        }
        const pets = await this.petRepository.listAllByUserId(customerId);

        return { pets, error: null }
    }
}