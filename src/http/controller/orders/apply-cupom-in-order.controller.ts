import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ApplyCupomInOrderService } from "../../../service/order/apply-cupom-in-order.service";
import { CupomRepositoryPrisma } from "../../../repository/prisma-repository/cupom-repository-prisma";
import { OrderRepositoryPrisma } from "../../../repository/prisma-repository/order-repository-prisma";
import { OrderNotFoundError } from "../../../service/error/order-not-found-error";
import { CupomNotFoundError } from "../../../service/error/cupom-not-found-error";

export async function ApplyCupomInOrderController(req: FastifyRequest, res: FastifyReply) {
    const applyCupomInOrderQuerySchema = z.object({
        cupom_id: z.string().min(1, "cupom_id is required"),
        order_id: z.string().min(1, "order_id is required")
    })
    const { cupom_id, order_id } = applyCupomInOrderQuerySchema.parse(req.body);
    const cupomRepository = new CupomRepositoryPrisma();
    const orderRepository = new OrderRepositoryPrisma();
    const applyCupomInOrderService = new ApplyCupomInOrderService(cupomRepository, orderRepository);
    const { order, error } = await applyCupomInOrderService.execute({ cupomId: cupom_id, orderId: order_id });

    if (error) {
        if (error instanceof OrderNotFoundError || error instanceof CupomNotFoundError) {
            return res.status(404).send({ message: error.message })
        }
        console.log("Internal Server Error in ApplyCupomInOrderController: " + error.message)
        return res.status(500).send({ message: "Internal Server Error: " + error.message })
    }
    return res.status(200).send(order)
}