import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { StoreRepositoryPrisma } from "../../repository/prisma-repository/store-repository-prisma";
import { UpdateStoreService } from "../../service/store/update-store.service";
import { StoreNotFoundError } from "../../service/error/store-not-found-error";

export async function UpdateStoreController(req:FastifyRequest,res:FastifyReply) {
    const updateStoreBodySchema = z.object({
        id:z.string(),
        title: z.string(),
        description: z.string(),
        cnpj: z.string(),
        image_url: z.string().url(),
    })

    const {id,title,description,cnpj,image_url} = updateStoreBodySchema.parse(req.body);

    const storeRepository = new StoreRepositoryPrisma();
    const updateStoreService = new UpdateStoreService(storeRepository);

    const {store,error} = await updateStoreService.execute({id,title,description,cnpj,imageUrl:image_url});

    if(error){
        if(error instanceof StoreNotFoundError){
            return res.status(404).send({message:error.message})
        }
        console.log("internal Server Error UpdateStoreController: "+ error.message)
        return res.status(500).send({message:"internal Server Error"})
    }

    return res.status(200).send(store)
}