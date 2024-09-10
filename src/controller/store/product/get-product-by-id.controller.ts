import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ProductRepositoryPrisma } from "../../../repository/prisma-repository/product-repository-prisma";
import { GetProductByIdService } from "../../../service/store/product/get-product-by-id.service";
import { ProductNotFoundError } from "../../../service/error/product-not-found-error";

export async function GetProductByIdController(request: FastifyRequest, reply: FastifyReply) {
    // Definindo o schema para validar o parâmetro `id` vindo de `request.params`
    const getProductByIdControllerParamsSchema = z.object({
        id: z.string(),
    });

    try {
        // Extraindo o `id` dos parâmetros da URL
        const { id } = getProductByIdControllerParamsSchema.parse(request.params);

        const productRepository = new ProductRepositoryPrisma();
        const getProductByIdService = new GetProductByIdService(productRepository);

        // Executa o serviço para buscar o produto pelo ID
        const { product } = await getProductByIdService.execute({ id });

        // Retorna o produto encontrado
        return reply.status(200).send(product);
    } catch (error) {
        if (error instanceof ProductNotFoundError) {
            console.log("GetProductByIdController: " + error.message);
            return reply.status(404).send({ message: error.message });
        }
        console.log("Internal Server Error GetProductByIdController: " + error);
        return reply.status(500).send({ message: "Internal Server Error" });
    }
}
