import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ConfirmOrderService } from "../../../service/order/confirm-order.service";
import { OrderRepositoryPrisma } from "../../../repository/prisma-repository/order-repository-prisma";
import { ProductRepositoryPrisma } from "../../../repository/prisma-repository/product-repository-prisma";
import { ProductInOrderRepositoryPrisma } from "../../../repository/prisma-repository/product-in-order-repository-prisma";
import { OrderNotFoundError } from "../../../service/error/order-not-found-error";
import { OrderDoesNotHaveProductInOrderRegisted } from "../../../service/error/order-does-not-have-productinorder-registed";
import { ProductNotFoundError } from "../../../service/error/product-not-found-error";
import { InsufficientStockError } from "../../../service/error/insufficient-stock-error";

export async function ConfirmOrderController(req: FastifyRequest, res: FastifyReply) {
    const confirmOrderBodySchema = z.object({
        id: z.string().min(1, "id is required"),
    })

    const { id } = confirmOrderBodySchema.parse(req.params)
    const orderRepository = new OrderRepositoryPrisma();
    const productRepository = new ProductRepositoryPrisma();
    const productInOrderRepository = new ProductInOrderRepositoryPrisma();
    const confirmOrderService = new ConfirmOrderService(orderRepository, productRepository, productInOrderRepository)

    const { order, error } = await confirmOrderService.execute({ id });

    if (error) {
        if (error instanceof OrderNotFoundError || error instanceof OrderDoesNotHaveProductInOrderRegisted || error instanceof ProductNotFoundError) {
            return res.status(404).send({ message: error.message })
        }
        if (error instanceof InsufficientStockError) {
            return res.status(400).send({ message: error.message })
        }
        console.log("Internal Server Error in ConfirmOrderController: " + error.message)
        return res.status(500).send({ message: "Internal Server Error" })
    }
    return res.status(200).send(order)
}