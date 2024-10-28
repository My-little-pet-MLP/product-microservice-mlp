import { $Enums, Pet } from "@prisma/client";
import { PetRepository } from "../../repository/pet-repository";
import { clearkClientCustomer } from "../../lib/cleark";
import { CustomerNotFoundError } from "../error/customer-not-found-error";
import { ErrorFetchingCustomerError } from "../error/error-fetchig-customer-error";
import { PetDontLiveMoreItError } from "../error/pet-dont-live-more-error";
import { PetsBreedMustHaveCharacteresError } from "../error/pets-breed-must-have-characteres-error";
import { NameIsMustLongError } from "../error/name-is-must-long-error";

interface RegisterPetServiceRequest {
    name: string;
    breed: string;
    age: number;
    imageUrl: string;
    size: "mini" | "pequeno" | "medio" | "grande" | "gigante";
    customerId: string;
}
interface RegisterPetServiceResponse {
    pet: Pet | null;
    error: Error | null;
}
export class RegisterPetService {
    constructor(private petRepository: PetRepository) { }
    async execute({ customerId, age, imageUrl, name, breed, size }: RegisterPetServiceRequest): Promise<RegisterPetServiceResponse> {
        try {
            const customerExists = await clearkClientCustomer.users.getUser(customerId);
            if (!customerExists) {
                return { pet: null, error: new CustomerNotFoundError() };
            }
        } catch (error) {
            return { pet: null, error: new ErrorFetchingCustomerError() };
        }

        if (age > 30 || age < 0) {
            return { pet: null, error: new PetDontLiveMoreItError }
        }
        if (breed.length > 80) {
            return { pet: null, error: new PetsBreedMustHaveCharacteresError }
        }
        if (name.length > 80) {
            return { pet: null, error: new NameIsMustLongError }
        }


        const pet = await this.petRepository.register({
            age,
            imageUrl,
            name,
            breed,
            size,
            customerId
        })

        return { pet, error: null }
    }
}