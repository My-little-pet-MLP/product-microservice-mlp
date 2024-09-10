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
        image_url: z.string().url(),
        description: z.string(),
        price_in_cents: z.number().int(),
        stock: z.number().int().min(0),
        category_id: z.string(),
        store_id: z.string()
    })

    try {
        const { title, image_url, description, price_in_cents, stock, category_id, store_id } = RegisterProductControllerBodySchema.parse(request.body)

        const productRepository = new ProductRepositoryPrisma();
        const registerProductService = new RegisterProductService(productRepository);
        const { productRegister } = await registerProductService.execute({
            title,
            imageUrl:image_url,
            description,
            priceInCents:price_in_cents,
            stock,
            categoryId:category_id,
            storeId:store_id
        })

        return reply.status(201).send(productRegister);
    } catch (error) {
        if (error instanceof StoreNotFoundError || error instanceof UnRegisterCategoryError){
            return reply.status(404).send({message:error.message})
        }
        if (error instanceof ErrorRegisteringProductError){
            return reply.status(500).send({message:"Internal Server Error!"+error.message})
        }
        console.log("Internal Server Error RegisterProductController: "+error)
        return reply.status(500).send({message:"Internal Server Error!"});
    }
}