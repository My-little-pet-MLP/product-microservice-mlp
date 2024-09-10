import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { CategoryRepositoryPrisma } from "../../../../repository/prisma-repository/category-repository-prisma";
import { RegisterCategoryService } from "../../../../service/store/product/category/register-category.service";

export async function RegisterCategoryController(request:FastifyRequest, reply:FastifyReply) {
    const RegisterCategoryControllerBodySchema = z.object({
        title: z.string(),
    })

    try{
        const {title} = RegisterCategoryControllerBodySchema.parse(request.body)

        const categoryRepository = new CategoryRepositoryPrisma();
        const registerCategoryService = new RegisterCategoryService(categoryRepository);

        const {category} = await registerCategoryService.execute({title});

        return reply.status(201).send(category)
    }catch(error){
        if(error instanceof Error){
            return reply.status(400).send({message:error.message});
        }
        console.log("Internal Server Error RegisterCategoryController: " + error);
        return reply.status(500).send({message:"Internal Server Error!"});
    }
}