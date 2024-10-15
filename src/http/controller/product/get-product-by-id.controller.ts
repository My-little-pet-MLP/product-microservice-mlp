import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ProductRepositoryPrisma } from "../../../repository/prisma-repository/product-repository-prisma";
import { StoreRepositoryPrisma } from "../../../repository/prisma-repository/store-repository-prisma";
import { CategoryRepositoryPrisma } from "../../../repository/prisma-repository/category-repository-prisma";
import { GetProductByIdService } from "../../../service/product/get-product-by-id.service";
import { ProductNotFoundError } from "../../../service/error/product-not-found-error";
import { CategoryNotFoundError } from "../../../service/error/category-not-found-error";
import { StoreNotFoundError } from "../../../service/error/store-not-found-error";

export async function GetProductByIdController(req: FastifyRequest, res: FastifyReply) {
    const paramsSchema = z.object({
        id: z.string(),
    });

    const { id } = paramsSchema.parse(req.params);

    const productRepository = new ProductRepositoryPrisma();
    const storeRepository = new StoreRepositoryPrisma();
    const categoryRepository = new CategoryRepositoryPrisma();

    const getProductByIdService = new GetProductByIdService(
        productRepository,
        storeRepository,
        categoryRepository
    );

    const { product, error } = await getProductByIdService.execute({ id });

    if (error) {
        if (error instanceof ProductNotFoundError) {
            return res.status(404).send({ message: error.message });
        } else if (error instanceof CategoryNotFoundError) {
            return res.status(404).send({ message: error.message });
        } else if (error instanceof StoreNotFoundError) {
            return res.status(404).send({ message: error.message });
        } else {
            return res.status(500).send({ message: "Internal Server Error" });
        }
    }

    return res.status(200).send(product);
}
