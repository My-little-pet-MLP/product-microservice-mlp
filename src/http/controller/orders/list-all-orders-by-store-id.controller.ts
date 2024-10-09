import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ListAllOrdersByStoreIdService } from "../../../service/order/list-all-orders-by-store-id.service";
import { OrderRepositoryPrisma } from "../../../repository/prisma-repository/order-repository-prisma";
import { StoreRepositoryPrisma } from "../../../repository/prisma-repository/store-repository-prisma";
import { StoreNotFoundError } from "../../../service/error/store-not-found-error";

export async function ListAllOrdersByStoreIdController(req: FastifyRequest, res: FastifyReply) {
    const listAllOrdersByStoreIdQuerySchema = z.object({
        store_id: z.string().min(1, "store_id is required"),
        page: z.coerce.number().int().min(1, "page is required"),
        size: z.coerce.number().int().min(1, "size min is 1"),
    })

    const { size, page, store_id } = listAllOrdersByStoreIdQuerySchema.parse(req.query)

    const orderRepository = new OrderRepositoryPrisma();
    const storeRepository = new StoreRepositoryPrisma();
    const listAllOrdersByStoreId = new ListAllOrdersByStoreIdService(orderRepository, storeRepository);

    const { orders,totalPages, error } = await listAllOrdersByStoreId.execute({ storeId: store_id, page, size });

    if (error) {
        if (error instanceof StoreNotFoundError) {
            return res.status(404).send({ message: error.message })
        }
        console.log("Internal Server Error in ListAllOrdersByStoreIdController: " + error.message)
        return res.status(500).send({ message: "Intenal Server Error" })
    }
    return res.status(200).send({
        orders,
        totalPages: totalPages,
        currentPage: page,
    })
}