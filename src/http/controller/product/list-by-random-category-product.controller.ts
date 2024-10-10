import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ProductRepositoryPrisma } from "../../../repository/prisma-repository/product-repository-prisma";
import { CategoryRepositoryPrisma } from "../../../repository/prisma-repository/category-repository-prisma";
import { ListAllProductByCategoryRandomService } from "../../../service/product/list-product-by-category-random.service";
import { CategoryNotFoundError } from "../../../service/error/category-not-found-error";

export async function ListAllProductByCategoryRandomController(req: FastifyRequest, res: FastifyReply) {
    // Validação dos parâmetros de consulta com Zod
    const QuerySchema = z.object({
        page: z.coerce.number().int().min(1).default(1),  // Página deve ser um número inteiro positivo
        size: z.coerce.number().int().min(1).default(10), // Tamanho deve ser um número inteiro positivo
    });
    
    // Parsing dos parâmetros de consulta
    const { page, size } = QuerySchema.parse(req.query);

    // Instanciando os repositórios e o serviço
    const productRepository = new ProductRepositoryPrisma();
    const categoryRepository = new CategoryRepositoryPrisma();
    const listAllProductByCategoryRandomService = new ListAllProductByCategoryRandomService(productRepository, categoryRepository);

    // Chamando o serviço para listar os produtos aleatoriamente por categoria
    const { category, products, totalPages, error } = await listAllProductByCategoryRandomService.execute({ page, size });

    // Tratamento de erros
    if (error) {
        if (error instanceof CategoryNotFoundError) {
            return res.status(404).send({ message: error.message });
        }
        return res.status(500).send({ message: "Internal Server Error" });
    }

    // Retornar a categoria, os produtos, total de páginas e a página atual
    return res.status(200).send({
        category,
        products,
        totalPages,
        currentPage: page,
    });
}
