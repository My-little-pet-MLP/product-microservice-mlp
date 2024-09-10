import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { RegisterStoreService } from "../../service/store/register-store.service";
import { StoreRepositoryPrisma } from "../../repository/prisma-repository/store-repository-prisma";
import { UserNotFoundError } from "../../service/error/user-not-found-error";

export async function RegisterStoreController(request:FastifyRequest,reply:FastifyReply) {

    const RegisterStoreControllerBodySchema = z.object({
        title:z.string(),
        description:z.string(),
        cnpj: z.string().regex(/^\d{14}$/, "The CNPJ must contain exactly 14 numbers"),
        user_id:z.string()
    })

    try{
        const {title,description,cnpj,user_id} = RegisterStoreControllerBodySchema.parse(request.body)

        const storeRepository = new StoreRepositoryPrisma();
        const registerStoreService = new RegisterStoreService(storeRepository);
        const {storeRegister} = await registerStoreService.execute({title,description,cnpj,userId:user_id});

        return reply.status(201).send(storeRegister)
    }
    catch(error){
        if(error instanceof UserNotFoundError){
            return reply.status(404).send({message:error.message})
        }
        console.log(error)
        return reply.status(500).send({message:"Internal Server Error"})
    }
}