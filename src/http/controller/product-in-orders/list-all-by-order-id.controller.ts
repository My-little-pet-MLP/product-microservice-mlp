import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { OrderRepositoryPrisma } from "../../../repository/prisma-repository/order-repository-prisma";
import { ProductInOrderRepositoryPrisma } from "../../../repository/prisma-repository/product-in-order-repository-prisma";
import { ListAllProductsInOrdersByOrderId } from "../../../service/product-in-orders/list-all-by-order-id.service";
import { OrderNotFoundError } from "../../../service/error/order-not-found-error";

export async function ListAllByOrderIdController(req: FastifyRequest, res: FastifyReply) {
    const listAllByOrderIdRequestSchema = z.object({
        order_id: z.string().min(1, "order_id is required"),
    })
    const { order_id } = listAllByOrderIdRequestSchema.parse(req.params)

    const orderRepository = new OrderRepositoryPrisma();
    const productInOrdersRepository = new ProductInOrderRepositoryPrisma();
    const listAllProductsInOrdersByOrderId = new ListAllProductsInOrdersByOrderId(productInOrdersRepository, orderRepository);

    const { productsInOrders, error } = await listAllProductsInOrdersByOrderId.execute({ orderId: order_id });
    if (error) {
        if (error instanceof OrderNotFoundError) {
            return res.status(404).send({ message: error.message })
        }
        console.log("Internal Server error in ListAllByOrderIdController: " + error.message)
        return res.status(500).send({ message: error.message })
    }
    return res.status(200).send(productsInOrders)
}