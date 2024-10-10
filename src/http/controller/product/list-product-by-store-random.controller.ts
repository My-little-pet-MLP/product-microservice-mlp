import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ProductRepositoryPrisma } from "../../../repository/prisma-repository/product-repository-prisma";
import { StoreRepositoryPrisma } from "../../../repository/prisma-repository/store-repository-prisma";
import { ListAllProductByStoreRandomService } from "../../../service/product/list-product-by-random-store.service";
import { StoreNotFoundError } from "../../../service/error/store-not-found-error";

export async function ListProductByRandomStoreController(req: FastifyRequest, res: FastifyReply) {
    // Validação dos parâmetros de consulta com Zod
    const QuerySchema = z.object({
        page: z.coerce.number().int().min(1).default(1),  // Página deve ser um número inteiro positivo
        size: z.coerce.number().int().min(1).default(10), // Tamanho deve ser um número inteiro positivo
    });

    // Parsing dos parâmetros de consulta
    const { page, size } = QuerySchema.parse(req.query);

    // Instanciando os repositórios e o serviço
    const productRepository = new ProductRepositoryPrisma();
    const storeRepository = new StoreRepositoryPrisma();
    const listAllProductByStoreRandomService = new ListAllProductByStoreRandomService(productRepository, storeRepository);

    // Chamando o serviço para listar os produtos de uma loja aleatória
    const { store, products, totalPages, error } = await listAllProductByStoreRandomService.execute({ page, size });

    // Tratamento de erros
    if (error) {
        if (error instanceof StoreNotFoundError) {
            return res.status(404).send({ message: error.message });
        }
        return res.status(500).send({ message: "Internal Server Error" });
    }

    // Retornar a loja, os produtos, total de páginas e a página atual
    return res.status(200).send({
        store,
        products,
        totalPages,
        currentPage: page,
    });
}
