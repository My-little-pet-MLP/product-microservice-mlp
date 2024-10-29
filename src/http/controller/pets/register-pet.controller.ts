import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { PetRepositoryPrisma } from "../../../repository/prisma-repository/pet-repository-prisma";
import { RegisterPetService } from "../../../service/pet/register-pet.service";
import { CustomerNotFoundError } from "../../../service/error/customer-not-found-error";
import { ErrorFetchingCustomerError } from "../../../service/error/error-fetchig-customer-error";
import { PetDontLiveMoreItError } from "../../../service/error/pet-dont-live-more-error";
import { PetsBreedMustHaveCharacteresError } from "../../../service/error/pets-breed-must-have-characteres-error";
import { NameIsMustLongError } from "../../../service/error/name-is-must-long-error";

export async function RegisterPetController(req: FastifyRequest, res: FastifyReply) {
    const registerPetBodySchema = z.object({
        name: z.string().min(1, "name is required"),
        age: z.number().int().min(0, "min age is 0 years").max(30, "max age is 30 years"),
        breed: z.string(),
        size: z.enum(["mini", "pequeno", "medio", "grande", "gigante"]),
        imageUrl: z.string().url(),
        customerId: z.string()
    })
    const { name, customerId, imageUrl, age, breed, size } = registerPetBodySchema.parse(req.body)

    const petRepository = new PetRepositoryPrisma();

    const registerPetService = new RegisterPetService(petRepository);

    const { pet, error } = await registerPetService.execute({ name, customerId, imageUrl, age, breed, size })

    if (error) {
        if (error instanceof CustomerNotFoundError) {
            return res.status(404).send({ message: error.message })
        }
        if (error instanceof ErrorFetchingCustomerError || error instanceof PetDontLiveMoreItError || error instanceof PetsBreedMustHaveCharacteresError || error instanceof NameIsMustLongError) {
            return res.status(400).send({ message: error.message })
        }
        console.log("Internal Server Erro in RegisterPetController: " + error.message)
        return res.status(500).send({ message: "Internal Server Error" })
    }
    return res.status(200).send(pet)
}