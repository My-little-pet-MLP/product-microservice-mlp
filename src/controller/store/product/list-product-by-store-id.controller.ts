import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ProductRepositoryPrisma } from "../../../repository/prisma-repository/product-repository-prisma";
import { ListProductByStoreIdService } from "../../../service/store/product/list-product-by-store-id.service";

export async function ListProductByStoreIdController(request: FastifyRequest, reply: FastifyReply) {
    const ListProductByStoreIdControllerQuerySchema = z.object({
        store_id: z.string(),
        page: z.coerce.number().int().default(1),
        size: z.coerce.number().int().default(8)
    });

    try {
        // Valida e obtém os parâmetros da query
        const { page, size, store_id } = ListProductByStoreIdControllerQuerySchema.parse(request.query);

        // Instancia o repositório e o serviço
        const productRepository = new ProductRepositoryPrisma();
        const listProductByStoreIdService = new ListProductByStoreIdService(productRepository);

        // Executa o serviço para obter a lista de produtos
        const { products } = await listProductByStoreIdService.execute({ storeId: store_id, page, size });

        // Mapeia os produtos para incluir apenas os campos necessários
        const filteredProducts = products.map(product => ({
            id: product.id,
            title: product.title,
            imageUrl: product.imageUrl,
            priceInCents: product.priceInCents,
            stock: product.stock
        }));

        // Retorna os produtos filtrados
        return reply.status(200).send(filteredProducts);
    } catch (error) {
        console.log("Internal Server Error ListProductByStoreIdController: " + error);
        return reply.status(500).send({ message: "Internal Server Error" });
    }
}
