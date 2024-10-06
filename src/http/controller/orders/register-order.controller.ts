import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { OrderRepositoryPrisma } from "../../../repository/prisma-repository/order-repository-prisma";
import { RegisterOrderService } from "../../../service/order/register-order.service";
import { StoreRepositoryPrisma } from "../../../repository/prisma-repository/store-repository-prisma";
import { StoreNotFoundError } from "../../../service/error/store-not-found-error";

export async function RegisterOrderController(req: FastifyRequest, res: FastifyReply) {
    const RegisterOrderBodySchema = z.object({
        store_id: z.string(),
        customer_id: z.string(),
        customer_id_stripe: z.string(),
    })

    const { customer_id, customer_id_stripe, store_id } = RegisterOrderBodySchema.parse(req.body)
    const orderRepository = new OrderRepositoryPrisma();
    const storeRepository = new StoreRepositoryPrisma();
    const registerOrderService = new RegisterOrderService(orderRepository, storeRepository);

    const { order, error } = await registerOrderService.execute({ storeId: store_id, customerId: customer_id, customerIdStripe: customer_id_stripe });
    if (error) {
        if (error instanceof StoreNotFoundError) {
            return res.status(404).send({ message: error.message })
        }
        return res.status(500).send({ message: error.message })
    }
    return res.status(200).send(order)
}