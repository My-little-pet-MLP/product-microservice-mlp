import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { RegisterProductService } from "../../../service/store/product/register-product.service";
import { StoreNotFoundError } from "../../../service/error/store-not-found-error";
import { UnRegisterCategoryError } from "../../../service/error/unregister-category-error";
import { ProductRepositoryPrisma } from "../../../repository/prisma-repository/product-repository-prisma";
import { ErrorRegisteringProductError } from "../../../service/error/error-registering-product-error";

export async function RegisterProductController(request: FastifyRequest, reply: FastifyReply) {

    const RegisterProductControllerBodySchema = z.object({
        title: z.string(),
        imageUrl: z.string().url(),
        description: z.string(),
        priceInCents: z.number().int(),
        stock: z.number().int().min(0),
        categoryId: z.string(),
        storeId: z.string()
    })

    try {
        const { title, imageUrl, description, priceInCents, stock, categoryId, storeId } = RegisterProductControllerBodySchema.parse(request.body)

        const productRepository = new ProductRepositoryPrisma();
        const registerProductService = new RegisterProductService(productRepository);
        const { productRegister } = await registerProductService.execute({
            title,
            imageUrl,
            description,
            priceInCents,
            stock,
            categoryId,
            storeId
        })

        return reply.status(201).send(productRegister);
    } catch (error) {
        if (error instanceof StoreNotFoundError || error instanceof UnRegisterCategoryError){
            return reply.status(404).send({message:error.message})
        }
        if (error instanceof ErrorRegisteringProductError){
            return reply.status(500).send({message:"Internal Server Error!"+error.message})
        }
    }
}