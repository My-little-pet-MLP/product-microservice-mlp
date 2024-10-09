import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { VerifyCustomerHavePedingOrderService } from "../../../service/order/verify-customer-have-peding-order.service";
import { OrderRepositoryPrisma } from "../../../repository/prisma-repository/order-repository-prisma";
import { OrderNotFoundError } from "../../../service/error/order-not-found-error";

export async function VerifyCustomerHaveOrderController(req: FastifyRequest, res: FastifyReply) {
    const verifyCustomerHaveOrderSchema = z.object({
        customer_id: z.string().min(1, "customer_id is required"),
        store_id: z.string().min(1, "store_id is required")
    })
    const { customer_id, store_id } = verifyCustomerHaveOrderSchema.parse(req.query)


    const orderRepository = new OrderRepositoryPrisma();

    const verifyCustomerHaveOrderService = new VerifyCustomerHavePedingOrderService(orderRepository);

    const { order, error } = await verifyCustomerHaveOrderService.execute({ customerId: customer_id, storeId: store_id })

    if (error) {
        if (error instanceof OrderNotFoundError) {
            return res.status(404).send({ message: error.message })
        }
        console.log("Internal Server Error in VerifyCustomerHaveOrderController: " + error.message)
        return res.status(500).send({ message: "Internal Server Error" })
    }
    return res.status(200).send(order)
}