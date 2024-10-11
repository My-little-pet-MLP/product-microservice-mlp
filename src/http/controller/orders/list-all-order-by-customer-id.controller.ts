import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { OrderRepositoryPrisma } from "../../../repository/prisma-repository/order-repository-prisma";
import { ListAllByCustomerIdService } from "../../../service/order/list-all-by-customer-id.service";
import { OrderNotFoundError } from "../../../service/error/order-not-found-error";

export async function ListAllOrdersByCustomerIdController(req: FastifyRequest, res: FastifyReply) {
    const ListAllOrdersByCustomerIdQuerySchema = z.object({
        customer_id: z.string(),
        page: z.coerce.number().int(),
        size: z.coerce.number().int(),
    })
    const { customer_id, page, size } = ListAllOrdersByCustomerIdQuerySchema.parse(req.query);

    const orderRepository = new OrderRepositoryPrisma();
    const listAllByCustomerIdService = new ListAllByCustomerIdService(orderRepository);

    const { orders, error, totalPages } = await listAllByCustomerIdService.execute({ customerId: customer_id, page, size });
    if (error) {
        if (error instanceof OrderNotFoundError) {
            return res.status(404).send({ message: error.message })
        }
        console.log("Internal Server Error: " + error.message)
        return res.status(500).send({ message: "Internal Server Error" })
    }
    return res.status(200).send({
        orders,
        totalPages: totalPages,
        currentPage: page,
    })
}
