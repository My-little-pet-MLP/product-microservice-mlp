import { Pet } from "@prisma/client";
import { PetRepository } from "../../repository/pet-repository";
import { PetNotFoundError } from "../error/pet-not-found-error";
import { PetDontLiveMoreItError } from "../error/pet-dont-live-more-error";
import { PetsBreedMustHaveCharacteresError } from "../error/pets-breed-must-have-characteres-error";
import { NameIsMustLongError } from "../error/name-is-must-long-error";

interface UpdatePetServiceRequest {
    id: string;
    name: string;
    breed: string;
    age: number;
    imageUrl: string;
    size: "mini" | "pequeno" | "medio" | "grande" | "gigante";
}
interface UpdatePetServiceResponse {
    pet: Pet | null;
    error: Error | null;
}
export class UpdatePetService {
    constructor(private petRepository: PetRepository) { }
    async execute({ id, name, size, age, breed, imageUrl }: UpdatePetServiceRequest): Promise<UpdatePetServiceResponse> {
        const petExists = await this.petRepository.findById(id);
        if (!petExists) {
            return { pet: null, error: new PetNotFoundError }
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
        const pet = await this.petRepository.update(id, {
            age,
            breed,
            imageUrl,
            name,
            size
        })
        return { pet, error: null }
    }
}