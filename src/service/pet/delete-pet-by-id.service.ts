import { Pet } from "@prisma/client";
import { PetRepository } from "../../repository/pet-repository";
import { PetNotFoundError } from "../error/pet-not-found-error";

interface DeletePetByIdServiceRequest {
    id: string;
}
interface DeletePetByIdServiceResponse {
    error: Error | null;
}

export class DeletePetByIdService {
    constructor(private petRepository: PetRepository) { }

    async execute({ id }: DeletePetByIdServiceRequest): Promise<DeletePetByIdServiceResponse> {
        const petExists = await this.petRepository.findById(id);
        if (!petExists) {
            return { error: new PetNotFoundError }
        }
        await this.petRepository.delete(id);
        return { error: null }
    }
}