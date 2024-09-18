import { FastifyReply, FastifyRequest } from "fastify";
import { CategoryRepositoryPrisma } from "../../repository/prisma-repository/category-repository-prisma";
import { RegisterCategoryService } from "../../service/category/register-category.service";
import { z } from "zod";

export async function RegisterCategoryController(req:FastifyRequest,res:FastifyReply) {
    const bodySchema = z.object({
        title:z.string(),
    })
    const {title} = bodySchema.parse(req.body)
    const categoryRepository = new CategoryRepositoryPrisma();
    const registerCategoryService = new RegisterCategoryService(categoryRepository);

    const {category} = await registerCategoryService.execute({title})

    return res.status(200).send(category)
}