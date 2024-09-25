import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { OrderRepositoryPrisma } from "../../../repository/prisma-repository/order-repository-prisma";
import { GetByIdOrderService } from "../../../service/order/get-by-id-order.service";
import { OrderNotFoundError } from "../../../service/error/order-not-found-error";

export async function GetByIdOrderController(req: FastifyRequest, res: FastifyReply) {
    const paramsSchema = z.object({
        id: z.string()
    })

    const { id } = paramsSchema.parse(req.params)

    const orderRepository = new OrderRepositoryPrisma();
    const getByIdOrderService = new GetByIdOrderService(orderRepository);

    const { order, error } = await getByIdOrderService.execute({ id });
    if (error) {
        if (error instanceof OrderNotFoundError) {
            return res.status(404).send({ message: error.message })
        }
        return res.status(500).send({ message: "Internal Server Error" })
    }
    return res.status(200).send(order)
}