import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { StoreRepositoryPrisma } from "../../../repository/prisma-repository/store-repository-prisma";
import { DeleteStoreByIdService } from "../../../service/store/delete-store-by-id.service";

export async function DeleteStoreByIdController(req:FastifyRequest,res:FastifyReply) {
    const deleteStoreByIdParamsSchema = z.object({
        id:z.string().min(1,"id is required")
    })
    const {id} = deleteStoreByIdParamsSchema.parse(req.params)    
    const storeRepository = new StoreRepositoryPrisma();

    const deleteStoreByIdService = new DeleteStoreByIdService(storeRepository)

    const {} = await deleteStoreByIdService.execute({id})

    return res.status(204)
}