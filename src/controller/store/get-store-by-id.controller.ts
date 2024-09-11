import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { StoreRepositoryPrisma } from "../../repository/prisma-repository/store-repository-prisma";
import { GetStoreByIdService } from "../../service/store/get-store-by-id.service";
import { StoreNotFoundError } from "../../service/error/store-not-found-error";

export async function GetStoreByIdController(request:FastifyRequest,reply:FastifyReply) {
    const GetStoreByIdControllerParamsSchema = z.object({
        id:z.string()
    })
    try{
        const {id} = GetStoreByIdControllerParamsSchema.parse(request.params)
        const storeRepository = new StoreRepositoryPrisma();
        const getStoreByIdService = new GetStoreByIdService(storeRepository);

        const {store} = await getStoreByIdService.execute({id});

        return reply.status(200).send(store);
    }
    catch(error){
        if(error instanceof StoreNotFoundError){
            return reply.status(404).send({message:error.message})
        }
        console.log("Internal Server Error GetStoreByIdController: "+error)
        return reply.status(500).send({message:"Internal Server Error"})
    }
}