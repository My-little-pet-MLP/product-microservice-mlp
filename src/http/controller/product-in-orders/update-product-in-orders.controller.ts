import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { UpdateProductInOrdersService } from "../../../service/product-in-orders/update-product-in-orders.service";
import { ProductInOrderRepositoryPrisma } from "../../../repository/prisma-repository/product-in-order-repository-prisma";
import { OrderRepositoryPrisma } from "../../../repository/prisma-repository/order-repository-prisma";
import { ProductRepositoryPrisma } from "../../../repository/prisma-repository/product-repository-prisma";
import { OrderNotFoundError } from "../../../service/error/order-not-found-error";
import { ProductNotFoundError } from "../../../service/error/product-not-found-error";
import { QuantityIsNegativeError } from "../../../service/error/quantity-is-negative-error";

export async function UpdateProductInOrdersController(req: FastifyRequest, res: FastifyReply) {
    const updateProductInOrdersBodySchema = z.object({
        id: z.string(),
        order_id: z.string(),
        product_id: z.string(),
        quantity: z.number().int().min(0, "quantity >= 0"),
    })
    const { id, order_id, product_id, quantity } = updateProductInOrdersBodySchema.parse(req.body)
    const productInOrdersRepository = new ProductInOrderRepositoryPrisma()
    const orderRepository = new OrderRepositoryPrisma()
    const productRepository = new ProductRepositoryPrisma()
    const updateProductInOrdersService = new UpdateProductInOrdersService(productInOrdersRepository, orderRepository, productRepository)
    const { productInOrders, error } = await updateProductInOrdersService.execute({ id, orderId: order_id, productId: product_id, quantity })
    if (error) {
        if (error instanceof OrderNotFoundError || error instanceof ProductNotFoundError) {
            return res.status(404).send({ message: error.message })
        }
        if (error instanceof QuantityIsNegativeError) {
            return res.status(400).send({ message: error.message })
        }
        console.log("Internal Server Error in UpdateProductInOrdersController: " + error.message)
        return res.status(500).send({ message: "internal Server Error" })
    }
    return res.status(200).send(productInOrders)

}