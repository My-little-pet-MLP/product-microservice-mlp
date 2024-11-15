import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ListAllCouponByStoreIdService } from "../../../service/cupom/list-all-coupon-by-store-id.service";
import { CupomRepositoryPrisma } from "../../../repository/prisma-repository/cupom-repository-prisma";
import { StoreRepositoryPrisma } from "../../../repository/prisma-repository/store-repository-prisma";
import { StoreNotFoundError } from "../../../service/error/store-not-found-error";

export async function ListAllCouponByStoreIdController(req: FastifyRequest, res: FastifyReply) {
    const listAllCouponByStoreIdParamsSchema = z.object({
        store_id: z.string().min(1, "store_id is required")
    });

    const { store_id } = listAllCouponByStoreIdParamsSchema.parse(req.params)

    const cupomRepository = new CupomRepositoryPrisma();
    const storeRepository = new StoreRepositoryPrisma();
    const listAllCouponByStoreIdService = new ListAllCouponByStoreIdService(cupomRepository, storeRepository);

    const { cupons, error } = await listAllCouponByStoreIdService.execute({ storeId: store_id });

    if (error) {
        if (error instanceof StoreNotFoundError) {
            return res.status(404).send({ message: error.message })
        }
        console.log("Internal Server Error in ListAllCouponByStoreIdController:" + error.message)
        return res.status(500).send({ message: "Internal Server Error" })
    }

    return res.status(200).send(cupons)
}