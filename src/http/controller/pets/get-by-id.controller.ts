import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { GetPetByIdService } from "../../../service/pet/get-pet-by-id.service";
import { PetRepositoryPrisma } from "../../../repository/prisma-repository/pet-repository-prisma";
import { PetNotFoundError } from "../../../service/error/pet-not-found-error";

export async function GetByIdPetController(req: FastifyRequest, res: FastifyReply) {
    const getByIdPetParamsSchema = z.object({
        id: z.string().min(1, "id is required")
    })
    const { id } = getByIdPetParamsSchema.parse(req.params)
    const petRepository = new PetRepositoryPrisma();
    const getByIdPetService = new GetPetByIdService(petRepository)

    const { pet, error } = await getByIdPetService.execute({ id })

    if (error) {
        if (error instanceof PetNotFoundError) {
            return res.status(404).send({ message: error.message })
        }
        console.log("Internal Server Error in GetByIdPetController: " + error.message)
        return res.status(500).send({ message: "Internal Server Error" })
    }
    return res.status(200).send(pet)
}