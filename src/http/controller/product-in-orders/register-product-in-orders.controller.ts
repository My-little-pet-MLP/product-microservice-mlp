import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ProductInOrderRepositoryPrisma } from "../../../repository/prisma-repository/product-in-order-repository-prisma";
import { OrderRepositoryPrisma } from "../../../repository/prisma-repository/order-repository-prisma";
import { ProductRepositoryPrisma } from "../../../repository/prisma-repository/product-repository-prisma";
import { RegisterProductInOrdersService } from "../../../service/product-in-orders/register-product-in-orders.service";
import { OrderNotFoundError } from "../../../service/error/order-not-found-error";
import { ProductNotFoundError } from "../../../service/error/product-not-found-error";
import { OrderIsNotPedingError } from "../../../service/error/order-is-not-peding-error";
import { QuantityIsNegativeError } from "../../../service/error/quantity-is-negative-error";

export async function RegisterProductInOrdersController(req: FastifyRequest, res: FastifyReply) {
    const registerProductInOrdersBodySchema = z.object({
        order_id: z.string().min(1, "order_id is required"),
        product_id: z.string().min(1, "product_id is required"),
        quantity: z.number().int().min(0, "quantity is negative"),
    })
    const { order_id, product_id, quantity } = registerProductInOrdersBodySchema.parse(req.body)

    const productInOrdersRepository = new ProductInOrderRepositoryPrisma()
    const orderRepository = new OrderRepositoryPrisma()
    const productRepository = new ProductRepositoryPrisma();

    const registerProductInOrdersService = new RegisterProductInOrdersService(productInOrdersRepository, orderRepository, productRepository);

    const { productInOrders, error } = await registerProductInOrdersService.execute({ orderId: order_id, productId: product_id, quantity })

    if (error) {
        if (error instanceof OrderNotFoundError || error instanceof ProductNotFoundError) {
            return res.status(404).send({ message: error.message })
        }
        if (error instanceof OrderIsNotPedingError || error instanceof QuantityIsNegativeError) {
            return res.status(400).send({ message: error.message })
        }
        console.log("Internal Server Error in RegisterProductInOrdersController: " + error.message)
        return res.status(500).send({ message: "Internal Server Error!" })
    }
    return res.status(200).send(productInOrders)
}