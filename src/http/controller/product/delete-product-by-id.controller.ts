import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ProductRepositoryPrisma } from "../../../repository/prisma-repository/product-repository-prisma";
import { DeleteProductService } from "../../../service/product/delete-product.service";
import { ProductNotFoundError } from "../../../service/error/product-not-found-error";

export async function DeleteProductByIdController(req: FastifyRequest, res: FastifyReply) {
    const DeleteProductByIdParamsSchema = z.object({
        id: z.string().min(1, "Id is required!"),
    })
    const { id } = DeleteProductByIdParamsSchema.parse(req.params)

    const productRepository = new ProductRepositoryPrisma();
    const deleteProductByIdService = new DeleteProductService(productRepository);

    const { product, error } = await deleteProductByIdService.execute({ id });

    if (error) {
        if (error instanceof ProductNotFoundError) {
            return res.status(404).send({ message: error.message })
        }
        console.log("Internal Server Error in DeleteProductByIdController: " + error.message)
        return res.status(500).send({ message: "Internal Server Error!" })
    }
    res.status(204);
}