import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { PetRepositoryPrisma } from "../../../repository/prisma-repository/pet-repository-prisma";
import { UpdatePetService } from "../../../service/pet/update-pet.service";
import { PetDontLiveMoreItError } from "../../../service/error/pet-dont-live-more-error";
import { PetsBreedMustHaveCharacteresError } from "../../../service/error/pets-breed-must-have-characteres-error";
import { NameIsMustLongError } from "../../../service/error/name-is-must-long-error";

export async function UpdatePetByIdController(req: FastifyRequest, res: FastifyReply) {
    const updatePetByIdBodySchema = z.object({
        id: z.string().min(1, "id is required"),
        name: z.string(),
        age: z.number().int().min(0, "min age is 0 years").max(30, "max age is 30 years"),
        breed: z.string(),
        size: z.enum(["mini", "pequeno", "medio", "grande", "gigante"]),
        imageUrl: z.string(),
    })
    const { name, imageUrl, age, breed, size, id } = updatePetByIdBodySchema.parse(req.body)

    const petRepository = new PetRepositoryPrisma();

    const registerPetService = new UpdatePetService(petRepository);

    const { pet, error } = await registerPetService.execute({ name, id, imageUrl, age, breed, size })

    if (error) {
        if (error instanceof PetDontLiveMoreItError || error instanceof PetsBreedMustHaveCharacteresError || error instanceof NameIsMustLongError) {
            return res.status(400).send({ message: error.message });
        }
        console.log("Internal Server Erro in UpdatePetByIdController: " + error.message)
        return res.status(500).send({ message: "Internal Server Error" });
    }
    return res.status(200).send(pet);
}