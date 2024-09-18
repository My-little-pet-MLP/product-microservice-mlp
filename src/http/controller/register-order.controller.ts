import { FastifyReply, FastifyRequest } from "fastify";
import { RegisterOrderService } from "../../service/order/register-order.service";
import { OrderRepositoryPrisma } from "../../repository/prisma-repository/order-repository-prisma";
import { z } from "zod";
import { StoreNotFoundError } from "../../service/error/store-not-found-error";
import { StoreRepositoryPrisma } from "../../repository/prisma-repository/store-repository-prisma";

export async function RegisterOrderController(req: FastifyRequest, res: FastifyReply) {
    const bodySchema = z.object({
        customer_id: z.string(),
        customer_id_stripe: z.string(),
        store_id: z.string()
    })
    const { customer_id, customer_id_stripe, store_id } = bodySchema.parse(req.body)
    const orderRepository = new OrderRepositoryPrisma();
    const storeRepository = new StoreRepositoryPrisma();
    const registerOrderService = new RegisterOrderService(orderRepository, storeRepository);

    const { order, error } = await registerOrderService.execute({ customerId: customer_id, customerIdStripe: customer_id_stripe, storeId: store_id });

    if (error) {
        if (error instanceof StoreNotFoundError) {
            return res.status(404).send({ message: error.message })
        }
        return res.status(500).send({ message: "Internal Server Error" })
    }
    return res.status(200).send(order)
}