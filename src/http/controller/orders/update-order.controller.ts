import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { OrderRepositoryPrisma } from "../../../repository/prisma-repository/order-repository-prisma";
import { UpdateOrderService } from "../../../service/order/update-order.service";
import { $Enums, Prisma } from "@prisma/client"; // Importando o Prisma para utilizar o enum

export async function UpdateOrderController(req: FastifyRequest, res: FastifyReply) {
    const updateOrderControllerBodySchema = z.object({
        id: z.string(),
        status: z.enum([
            "pending",
            "awaiting_payment",
            "payment_confirmed",
            "processing",
            "shipped",
            "delivered",
            "canceled",
            "returned"
        ]),
        fullPriceOrderInCents: z.number().int().min(0),
    });

    const { id, status, fullPriceOrderInCents } = updateOrderControllerBodySchema.parse(req.body);

    const orderRepository = new OrderRepositoryPrisma();
    const updateOrderService = new UpdateOrderService(orderRepository);

    const { order, error } = await updateOrderService.execute({
        id,
        status: status as $Enums.OrderStatus, // Garantindo que o status seja convertido para o enum,
        fullPriceOrderInCents
    });

    if (error) {
        return res.status(404).send({ error: error.message });
    }

    return res.send({ order });
}
