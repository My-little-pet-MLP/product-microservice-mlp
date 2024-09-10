import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { GetStoreByUserIdService } from "../../service/store/get-store-by-user-id.service";
import { StoreRepositoryPrisma } from "../../repository/prisma-repository/store-repository-prisma";
import { ThereIsNoStoreRegisteredWithThisUserIdError } from "../../service/error/there-is-no-store-registered-with-this-user-id-error";



export async function GetStoreByUserIdController(request: FastifyRequest, reply: FastifyReply) {
    const GetStoreByUserIdControllerParamsSchema = z.object({
        user_id: z.string(),
    })

    try {
        const { user_id } = GetStoreByUserIdControllerParamsSchema.parse(request.params);

        const storeRepository = new StoreRepositoryPrisma();
        const getStoreByUserIdService = new GetStoreByUserIdService(storeRepository);

        const {store} = await getStoreByUserIdService.execute({userId:user_id});

        return reply.status(200).send(store)
    }
    catch (error) {
        if (error instanceof ThereIsNoStoreRegisteredWithThisUserIdError) {
            return reply.status(404).send({ message: error.message })
        }
    }
}