import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ProductRepositoryPrisma } from "../../repository/prisma-repository/product-repository-prisma";
import { ListProductByStoreIdService } from "../../service/product/list-product-by-store-id.service";
import { StoreRepositoryPrisma } from "../../repository/prisma-repository/store-repository-prisma";
import { StoreNotFoundError } from "../../service/error/store-not-found-error";

export async function ListProductByStoreIdController(req: FastifyRequest, res: FastifyReply) {
    const ParamsSchema = z.object({
        store_id: z.string(),
        page: z.coerce.number().int(),
        size: z.coerce.number().int(),
    })
    const { store_id, page, size } = ParamsSchema.parse(req.query)

    const productRepository = new ProductRepositoryPrisma();
    const storeRepository = new StoreRepositoryPrisma();
    const listProductByStoreIdService = new ListProductByStoreIdService(productRepository, storeRepository);

    const { products, error } = await listProductByStoreIdService.execute({ storeId: store_id, page, size })
    if (error) {
        if(error instanceof StoreNotFoundError){
            return res.status(404).send({ message: error.message })
        }
        return res.status(500).send({message:"Internal Server Error"})
    }
    return res.status(200).send(products)
}