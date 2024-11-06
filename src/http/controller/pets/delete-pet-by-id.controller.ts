import{ FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { PetRepositoryPrisma } from "../../../repository/prisma-repository/pet-repository-prisma";
import { DeletePetByIdService } from "../../../service/pet/delete-pet-by-id.service";
import { PetNotFoundError } from "../../../service/error/pet-not-found-error";

export async function DeletePetByIdController(req:FastifyRequest,res:FastifyReply) {
    const deletePetByIdParamsSchema = z.object({
        id:z.string().min(1,"id is required")
    })
    const {id} = deletePetByIdParamsSchema.parse(req.params)

    const petRepository = new PetRepositoryPrisma();

    const deletePetByIdService = new DeletePetByIdService(petRepository);

    const {error} = await deletePetByIdService.execute({id})
    if(error){
        if(error instanceof PetNotFoundError){
            return res.status(404).send({messsage:error.message})
        }
        console.log("Internal Server error in DeletePetByIdController: "+error.message)
        return res.status(500).send({message:"Internal Server Error"})
    }
    return res.status(204).send()
}