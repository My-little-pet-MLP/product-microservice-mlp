import { FastifyReply, FastifyRequest } from "fastify";
import { OrderRepositoryPrisma } from "../../repository/prisma-repository/order-repository-prisma";
import { ListOrdersByProductIdService } from "../../service/order/list-orders-by-product-id.service";
import { z } from "zod";

export async function ListOrdersByProductIdController(req: FastifyRequest, res: FastifyReply) {
    const querySchema = z.object({
        product_id: z.string(),
        page: z.coerce.number().int(),
        size: z.coerce.number().int()
    })
    const { product_id, page, size } = querySchema.parse(req.query)
    const orderRepository = new OrderRepositoryPrisma();
    const listOrdersByProductIdService = new ListOrdersByProductIdService(orderRepository);


    const { orders, error } = await listOrdersByProductIdService.execute({ productId: product_id, page, size })

    if (error) {
        return res.status(500).send({ message: "Internal Server Error" })
    }
    return res.status(200).send(orders)
}