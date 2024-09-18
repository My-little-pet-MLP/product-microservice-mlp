import { FastifyReply, FastifyRequest } from "fastify";
import { OrderRepositoryPrisma } from "../../repository/prisma-repository/order-repository-prisma";
import { ListOrdersByCustomerIdService } from "../../service/order/list-orders-by-customer-id.service";
import { z } from "zod";

export async function ListOrdersByCustomerIdController(req: FastifyRequest, res: FastifyReply) {
    const QuerySchema = z.object({
        customer_id: z.string(),
        size: z.coerce.number().int(),
        page: z.coerce.number().int(),
    })
    const { customer_id, page, size } = QuerySchema.parse(req.query)
    const orderRepository = new OrderRepositoryPrisma();
    const listOrdersByCustomerIdService = new ListOrdersByCustomerIdService(orderRepository);

    const { orders, error } = await listOrdersByCustomerIdService.execute({ customerId: customer_id, size, page });

    if (error) {

        return res.status(500).send({ message: error.message })
    }
    return res.status(200).send(orders)
}