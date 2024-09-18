import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { StoreRepositoryPrisma } from "../../repository/prisma-repository/store-repository-prisma";
import { RegisterStoreService } from "../../service/store/register-store.service";
import { UserNotFoundError } from "../../service/error/user-not-found-error";

interface StoreResponse {
    id: string;
    title: string;
    description: string;
    cnpj: string;
    createdAt: Date;
}
export async function RegisterStoreController(req: FastifyRequest, res: FastifyReply) {
    const bodySchema = z.object({
        title: z.string(),
        description: z.string(),
        cnpj: z.string(),
        user_id: z.string(),
        image_url: z.string().url(),
    })

    const { title, description, cnpj, user_id, image_url } = bodySchema.parse(req.body)

    const storeRepository = new StoreRepositoryPrisma();
    const registerStoreService = new RegisterStoreService(storeRepository);

    const { storeRegister, error } = await registerStoreService.execute({ title, description, cnpj, userId: user_id, imageUrl: image_url });


    if (error != null && error instanceof UserNotFoundError) {
        return res.send(404).send({ message: error.message })
    }
    if (storeRegister) {
        const store: StoreResponse = {
            id: storeRegister.id,
            title: storeRegister.title,
            description: storeRegister.description,
            cnpj: storeRegister.cnpj,
            createdAt: storeRegister.createdAt,
        };
        return res.status(200).send(store);
    }
    return res.send(500).send({ message: "Internal Server Error" })
}