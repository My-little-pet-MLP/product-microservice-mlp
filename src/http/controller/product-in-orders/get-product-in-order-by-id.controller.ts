import { FastifyReply, FastifyRequest } from "fastify";
import { ProductInOrderRepositoryPrisma } from "../../../repository/prisma-repository/product-in-order-repository-prisma";
import { GetProductInOrderByIdService } from "../../../service/product-in-orders/get-product-in-order-by-id.service";
import { z } from "zod";
import { ProductInOrdersNotFoundError } from "../../../service/error/product-in-orders-not-found-error";

export async function GetProductInOrderByIdController(req: FastifyRequest, res: FastifyReply) {

    const getProductInOrderByIdParamsSchema = z.object({
        id: z.string().min(1, "id is required")
    })
    const { id } = getProductInOrderByIdParamsSchema.parse(req.params)
    const productInOrderRepository = new ProductInOrderRepositoryPrisma()
    const getProductInOrderById = new GetProductInOrderByIdService(productInOrderRepository)


    const { productInOrder, error } = await getProductInOrderById.execute({ id });
    if (error) {
        if (error instanceof ProductInOrdersNotFoundError) {
            return res.status(404).send({ message: error.message })
        }
        console.log("Internal Server Error in GetProductInOrderByIdController: " + error.message)
        return res.status(500).send({ message: "Internal Server Error" })
    }
    return res.status(200).send(productInOrder)
}