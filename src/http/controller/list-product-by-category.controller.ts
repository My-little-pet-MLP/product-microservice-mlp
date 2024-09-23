import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ProductRepositoryPrisma } from "../../repository/prisma-repository/product-repository-prisma";
import { ListProductByCategoryService } from "../../service/product/list-product-by-category.service";
import { CategoryRepositoryPrisma } from "../../repository/prisma-repository/category-repository-prisma";
import { CategoryNotFoundError } from "../../service/error/category-not-found-error";

export async function ListProductByCategoryController(req: FastifyRequest, res: FastifyReply) {
    const ParamsSchema = z.object({
        category_id: z.string(),
        page: z.cource.number().int(),
        size: z.cource.number().int(),
    })
    const { category_id, page, size } = ParamsSchema.parse(req.query)

    const productRepository = new ProductRepositoryPrisma();
    const categoryRepository = new CategoryRepositoryPrisma();
    const listProductByCategoryService = new ListProductByCategoryService(productRepository, categoryRepository);

    const { products, error } = await listProductByCategoryService.execute({ categoryId: category_id, page, size })
    if (error) {
        if (error instanceof CategoryNotFoundError) {
            return res.status(404).send({ message: error.message });
        }
        return res.status(500).send({ message: "Internal Server Error" })
    }
    return res.status(200).send(products)
}
