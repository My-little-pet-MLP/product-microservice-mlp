import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { CupomRepositoryPrisma } from "../../../repository/prisma-repository/cupom-repository-prisma";
import { StoreRepositoryPrisma } from "../../../repository/prisma-repository/store-repository-prisma";
import { CustomerNotFoundError } from "../../../service/error/customer-not-found-error";
import { StoreNotFoundError } from "../../../service/error/store-not-found-error";
import { ErrorFetchingCustomerError } from "../../../service/error/error-fetchig-customer-error";
import { ListAllCupomByCustomerIdAndStoreIdService } from "../../../service/cupom/list-by-customer-id.service";

export async function ListAllCupomByCustomerIdAndStoreIdController(req: FastifyRequest, res: FastifyReply) {
    const listAllCupomParamsSchema = z.object({
        customer_id: z.string().min(1, "customer_id is required"),
        store_id: z.string().min(1, "store_id is required")
    });

    const { customer_id, store_id } = listAllCupomParamsSchema.parse(req.query);

    const cupomRepository = new CupomRepositoryPrisma();
    const storeRepository = new StoreRepositoryPrisma();
    const listAllCupomService = new ListAllCupomByCustomerIdAndStoreIdService(cupomRepository, storeRepository);

    const { cupons, error } = await listAllCupomService.execute({
        customerId: customer_id,
        storeId: store_id,
    });

    if (error) {
        if (error instanceof CustomerNotFoundError || error instanceof StoreNotFoundError) {
            return res.status(404).send({ message: error.message });
        }
        if (error instanceof ErrorFetchingCustomerError) {
            return res.status(400).send({ message: error.message });
        }
        console.log("Internal Server Error in ListAllCupomByCustomerIdAndStoreIdController: " + error.message);
        return res.status(500).send({ message: "Internal Server Error" });
    }

    return res.status(200).send(cupons);
}
