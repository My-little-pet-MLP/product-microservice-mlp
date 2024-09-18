import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { StoreRepositoryPrisma } from "../../repository/prisma-repository/store-repository-prisma";
import { GetStoreByIdService } from "../../service/store/get-store-by-id.service";
import { StoreNotFoundError } from "../../service/error/store-not-found-error";

export async function GetStoreByIdController(req: FastifyRequest, res: FastifyReply) {
    const getStoreByIdParamsSchema = z.object({
        id: z.string(),
    });

    const { id } = getStoreByIdParamsSchema.parse(req.params);

    const storeRepository = new StoreRepositoryPrisma();
    const getStoreByIdService = new GetStoreByIdService(storeRepository);

    const { store, error } = await getStoreByIdService.execute({ id });

    if (error != null) {
        if (error instanceof StoreNotFoundError) {
            return res.status(404).send({ message: error.message });
        }
        return res.status(500).send({ message: "Internal Server Error: " + error.message });
    }
    
    return res.status(200).send(store);
}
