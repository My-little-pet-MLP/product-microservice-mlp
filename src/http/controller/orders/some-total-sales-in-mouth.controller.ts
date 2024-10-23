import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { TotalSalesInMonthSomeService } from "../../../service/order/some-total-sales-in-mouth.service";
import { StoreRepositoryPrisma } from "../../../repository/prisma-repository/store-repository-prisma";
import { OrderRepositoryPrisma } from "../../../repository/prisma-repository/order-repository-prisma";
import { StoreNotFoundError } from "../../../service/error/store-not-found-error";

export async function SomeTotalSalesInMouthController(req: FastifyRequest, res: FastifyReply) {
    const SomeTotalSalesInMouthControllerParamsSchema = z.object({
        store_id: z.string().min(1, "store_id is required")
    })
    const { store_id } = SomeTotalSalesInMouthControllerParamsSchema.parse(req.params)
    const storeRepository = new StoreRepositoryPrisma();
    const orderRepository = new OrderRepositoryPrisma();

    const totalSalesInMonthSomeService = new TotalSalesInMonthSomeService(storeRepository, orderRepository)
    const { totalSalesInMonth, error } = await totalSalesInMonthSomeService.execute({ storeId: store_id })

    if (error) {
        if (error instanceof StoreNotFoundError) {
            return res.status(404).send({ message: error.message })
        }
        console.log("Internal Server Error in SomeTotalSalesInMouthController: " + error.message)
        return res.status(500).send({ message: "Internal Server Error" })
    }
    return res.status(200).send({ totalSalesInMonth })
}