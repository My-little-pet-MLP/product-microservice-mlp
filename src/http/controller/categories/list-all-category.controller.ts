import { FastifyReply, FastifyRequest } from "fastify";
import { CategoryRepositoryPrisma } from "../../../repository/prisma-repository/category-repository-prisma";
import { ListAllCategoryService } from "../../../service/category/list-all-category.service";

export async function  ListAllCategoryController(req:FastifyRequest,res:FastifyReply) {
    
    const categoryRepository = new CategoryRepositoryPrisma();
    const listAllCategoryService = new ListAllCategoryService(categoryRepository);

    const {categories} = await listAllCategoryService.execute({});

    return res.status(200).send(categories)
}