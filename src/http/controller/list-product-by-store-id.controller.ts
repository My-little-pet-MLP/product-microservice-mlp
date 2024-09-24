import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ProductRepositoryPrisma } from "../../repository/prisma-repository/product-repository-prisma";
import { ListProductByStoreIdService } from "../../service/product/list-product-by-store-id.service";
import { StoreRepositoryPrisma } from "../../repository/prisma-repository/store-repository-prisma";
import { StoreNotFoundError } from "../../service/error/store-not-found-error";

export async function ListProductByStoreIdController(req: FastifyRequest, res: FastifyReply) {
    // Validação dos parâmetros de consulta com Zod
    const ParamsSchema = z.object({
        store_id: z.string(),
        page: z.coerce.number().int(),
        size: z.coerce.number().int(),
    });
    
    // Parsing dos parâmetros de consulta
    const { store_id, page, size } = ParamsSchema.parse(req.query);

    // Instanciando os repositórios e serviços
    const productRepository = new ProductRepositoryPrisma();
    const storeRepository = new StoreRepositoryPrisma();
    const listProductByStoreIdService = new ListProductByStoreIdService(productRepository, storeRepository);

    // Chamando o serviço para listar os produtos pela loja
    const { products, totalPages, error } = await listProductByStoreIdService.execute({ storeId: store_id, page, size });
    
    // Tratamento de erros
    if (error) {
        if (error instanceof StoreNotFoundError) {
            return res.status(404).send({ message: error.message });
        }
        return res.status(500).send({ message: "Internal Server Error" });
    }

    // Retornar os produtos e o total de páginas na resposta
    return res.status(200).send({
        products,
        totalPages,
        currentPage: page,
    });
}
