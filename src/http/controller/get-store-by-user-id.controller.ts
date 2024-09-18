import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { StoreRepositoryPrisma } from "../../repository/prisma-repository/store-repository-prisma";
import { GetStoreByUserIdService } from "../../service/store/get-store-by-user-id.service";
import { ThereIsNoStoreRegisteredWithThisUserIdError } from "../../service/error/there-is-no-store-registered-with-this-user-id-error";


export async function GetStoreByUserIdController(req: FastifyRequest, res: FastifyReply) {
    const paramsSchema = z.object({
        user_id: z.string(),
    });

    const { user_id } = paramsSchema.parse(req.params);

    const storeRepository = new StoreRepositoryPrisma();
    const getStoreByUserIdService = new GetStoreByUserIdService(storeRepository);

    const { store, error } = await getStoreByUserIdService.execute({ userId: user_id });

    if (error != null) {
        if (error instanceof ThereIsNoStoreRegisteredWithThisUserIdError) {
            return res.status(404).send({ message: error.message });
        }
        return res.status(500).send({ message: "Internal Server Error: " + error.message });
    }

    return res.status(200).send(store);
}
