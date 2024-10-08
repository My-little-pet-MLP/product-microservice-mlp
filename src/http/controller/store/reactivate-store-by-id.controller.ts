import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { StoreRepositoryPrisma } from "../../../repository/prisma-repository/store-repository-prisma";
import { DeleteStoreByIdService } from "../../../service/store/delete-store-by-id.service";
import { ReactivateStoreByIdService } from "../../../service/store/reactivate-store-by-id.service";

export async function ReactivateStoreByIdController(req: FastifyRequest, res: FastifyReply) {
    const reactivateStoreByIdParamsSchema = z.object({
        id: z.string().min(1, "id is required")
    })
    const { id } = reactivateStoreByIdParamsSchema.parse(req.params)
    const storeRepository = new StoreRepositoryPrisma();

    const reactivateStoreByIdService = new ReactivateStoreByIdService(storeRepository)

    const { store, error } = await reactivateStoreByIdService.execute({ id })

    if (error) {
        console.log("Internal Server Error in ReactivateStoreByIdController: " + error.message)
        return res.status(500).send({ message: "Internal Server Error" })
    }
    return res.status(200).send(store);

}