import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { CategoryRepositoryPrisma } from "../../../../repository/prisma-repository/category-repository-prisma";
import { GetByIdCategoryService } from "../../../../service/store/product/category/get-by-id-category.service";
import { CategoryNotFoundError } from "../../../../service/error/category-not-found-error";

export async function GetCategoryByIdController(request:FastifyRequest,reply:FastifyReply) {
    const GetCategoryByIdControllerParamsSchema = z.object({
        id:z.string(),
    })
    try{

    
    const {id} = GetCategoryByIdControllerParamsSchema.parse(request.params)
    const categoryRepository = new CategoryRepositoryPrisma();
    const getCategoryByIdService = new GetByIdCategoryService(categoryRepository);

    const {category} = await getCategoryByIdService.execute({id});

    return reply.status(200).send(category);
    }
    catch(error){
        if(error instanceof CategoryNotFoundError){
            return reply.status(404).send({message:error.message});
        }
        console.log("Internal Server Error GetCategoryByIdController: "+error)
        return reply.status(500).send("Internal Server Error!");
    }
}