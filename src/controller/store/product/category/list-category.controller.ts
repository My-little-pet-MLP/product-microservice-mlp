import { FastifyReply, FastifyRequest } from "fastify";
import { CategoryRepositoryPrisma } from "../../../../repository/prisma-repository/category-repository-prisma";
import { ListAllCategoryService } from "../../../../service/store/product/category/list-all-category.service";

export async function ListCategoryController(request:FastifyRequest,reply:FastifyReply) {
    


    try{
        
        const categoryRepository = new CategoryRepositoryPrisma();
        const listAllCategoryService = new ListAllCategoryService(categoryRepository);

        const {categories} = await  listAllCategoryService.execute({});
        console.log(categories)
        return reply.status(200).send(categories);
    }catch(error){
        console.log("Internal Server Error ListCategoryController: " +error)
        return reply.status(500).send({message:"Internal Server Error!"});
    }
}