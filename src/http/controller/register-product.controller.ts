import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ProductRepositoryPrisma } from "../../repository/prisma-repository/product-repository-prisma";
import { RegisterProductService } from "../../service/product/register-product.service";
import { StoreRepositoryPrisma } from "../../repository/prisma-repository/store-repository-prisma";
import { CategoryRepositoryPrisma } from "../../repository/prisma-repository/category-repository-prisma";
import { StoreNotFoundError } from "../../service/error/store-not-found-error";
import { UnRegisterCategoryError } from "../../service/error/unregister-category-error";
import { ErrorRegisteringProductError } from "../../service/error/error-registering-product-error";

export async function RegisterProductController(req: FastifyRequest, res: FastifyReply) {
    const bodySchema = z.object({
        title: z.string(),
        image_url: z.string(),
        description: z.string(),
        price_in_cents: z.number().int(),
        stock: z.number().int(),
        category_id: z.string(),
        store_id: z.string(),
    });

    const { title, image_url, description, price_in_cents, stock, category_id, store_id } = bodySchema.parse(req.body);

    const productRepository = new ProductRepositoryPrisma();
    const storeRepository = new StoreRepositoryPrisma();
    const categoryRepository = new CategoryRepositoryPrisma();
    const registerProductService = new RegisterProductService(productRepository, storeRepository, categoryRepository);

    const { productRegister, error } = await registerProductService.execute({
        title,
        imageUrl: image_url,
        description,
        priceInCents: price_in_cents,
        stock,
        categoryId: category_id,
        storeId: store_id,
    });

    if (error instanceof StoreNotFoundError) {
        return res.status(404).send({ message:error.message });
    }

    if (error instanceof UnRegisterCategoryError) {
        return res.status(404).send({ message:error.message });
    }

    if (error instanceof ErrorRegisteringProductError) {
        return res.status(500).send({message:error.message });
    }

    if (!productRegister) {
        return res.status(500).send({ message: "Internal Server Error." });
    }

    return res.status(201).send(productRegister);
}
