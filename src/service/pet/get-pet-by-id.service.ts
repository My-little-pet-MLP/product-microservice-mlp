import { Pet } from "@prisma/client";
import { PetRepository } from "../../repository/pet-repository";
import { PetNotFoundError } from "../error/pet-not-found-error";

interface GetPetByIdServiceRequest {
    id: string;
}
interface GetPetByIdServiceResponse {
    pet: Pet | null;
    error: Error | null;
}
export class GetPetByIdService {
    constructor(private petRepository: PetRepository) { }
    async execute({ id }: GetPetByIdServiceRequest): Promise<GetPetByIdServiceResponse> {
        const pet = await this.petRepository.findById(id);
        if (!pet) {
            return {
                pet: null,
                error: new PetNotFoundError
            }
        }
        return {
            pet,
            error: null
        }
    }
}