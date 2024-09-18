import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { CategoryRepositoryPrisma } from "../../repository/prisma-repository/category-repository-prisma";
import { GetByIdCategoryService } from "../../service/category/get-by-id-category.service";
import { CategoryNotFoundError } from "../../service/error/category-not-found-error";

export async function GetByIdCategoryController(req: FastifyRequest, res: FastifyReply) {
    const ParamsSchema = z.object({
        id: z.string(),
    })

    const { id } = ParamsSchema.parse(req.params)

    const categoryRepository = new CategoryRepositoryPrisma();
    const getByIdCategoryService = new GetByIdCategoryService(categoryRepository);
    const { category, error } = await getByIdCategoryService.execute({ id });

    if (error) {
        if (error instanceof CategoryNotFoundError) {
            return res.status(404).send({ message: error.message })
        }
        return res.status(500).send({ message: "Internal Server Error" });
    }
    return res.send(200).send(category)
}