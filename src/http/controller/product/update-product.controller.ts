import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ProductRepositoryPrisma } from "../../../repository/prisma-repository/product-repository-prisma";
import { UpdateProductService } from "../../../service/product/update-product.service";
import { ProductNotFoundError } from "../../../service/error/product-not-found-error";

export async function UpdateProductController(req: FastifyRequest, res: FastifyReply) {
    const bodySchema = z.object({
        id: z.string().min(1, "id is required"),
        title: z.string().min(1, "Title is required"),
        description: z.string().min(1, "description is required"),
        image_url: z.string().url().min(1, "image_url is required"),
        price_in_cents: z.number().int().min(0, "price_in_cents > 0"),
        stock: z.number().int().min(0, "stock > 0"),
        category_id: z.string()
    })


    const { id, title, description, image_url, price_in_cents, stock, category_id } = bodySchema.parse(req.body)


    const productRepository = new ProductRepositoryPrisma();
    const updateProductService = new UpdateProductService(productRepository);


    const { product, error } = await updateProductService.execute({ id, title, description, imageUrl: image_url, priceInCents: price_in_cents, stock, categoryId: category_id })

    if (error) {
        if (error instanceof ProductNotFoundError) {
            return res.status(404).send({ message: error.message })
        }
        console.log("Internal Server Error: " + error.message)
        return res.status(500).send({ message: "Internal Server Error" })
    }
    return res.status(200).send(product)
}