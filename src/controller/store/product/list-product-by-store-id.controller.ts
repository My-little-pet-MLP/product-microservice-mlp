import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ProductRepositoryPrisma } from "../../../repository/prisma-repository/product-repository-prisma";
import { ListProductByStoreIdService } from "../../../service/store/product/list-product-by-store-id.service";

export async function ListProductByStoreIdController(request:FastifyRequest,reply:FastifyReply) {
    const ListProductByStoreIdControllerBodySchema = await z.object({
        store_id: z.string(),
        page: z.number().int().default(1),
        size:z.number().int().default(8)
    })

    try{
        const {page,size,store_id} = ListProductByStoreIdControllerBodySchema.parse(request.body)

        const productRepository = new ProductRepositoryPrisma();
        const listProductByStoreIdService = new ListProductByStoreIdService(productRepository);

        const {products} = await listProductByStoreIdService.execute({storeId:store_id,page,size});

        return reply.status(200).send(products);
     }
     catch(error){
        console.log("Internal Server Error ListProductByStoreIdController: "+error)
        return reply.status(500).send({message:"Internal Server Error"})
     }
}