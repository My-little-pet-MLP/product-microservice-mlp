import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ProductRepositoryPrisma } from "../../repository/prisma-repository/product-repository-prisma";
import { GetProductByIdService } from "../../service/product/get-product-by-id.service";
import { ProductNotFoundError } from "../../service/error/product-not-found-error";

export async function GetProductByIdController(req: FastifyRequest, res: FastifyReply) {
    const paramsSchema = z.object({
        id: z.string(),
    })

    const { id } = paramsSchema.parse(req.params)


    const productRepository = new ProductRepositoryPrisma();
    const getProductByIdService = new GetProductByIdService(productRepository);

    const { product, error } = await getProductByIdService.execute({ id });

    if (error && error instanceof ProductNotFoundError) {
        return res.status(404).send({ message: error.message })
    }
    if (product) {
        return res.status(200).send(product);
    }
    return res.status(500).send({message:"Internal Server Error"});
}