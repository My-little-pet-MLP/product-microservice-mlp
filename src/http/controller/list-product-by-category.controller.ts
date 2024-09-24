import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ProductRepositoryPrisma } from "../../repository/prisma-repository/product-repository-prisma";
import { ListProductByCategoryService } from "../../service/product/list-product-by-category.service";
import { CategoryRepositoryPrisma } from "../../repository/prisma-repository/category-repository-prisma";
import { CategoryNotFoundError } from "../../service/error/category-not-found-error";

export async function ListProductByCategoryController(req: FastifyRequest, res: FastifyReply) {
    // Validação dos parâmetros de consulta com Zod
    const ParamsSchema = z.object({
        category_id: z.string(),
        page: z.coerce.number().int(),
        size: z.coerce.number().int(),
    });
    
    // Parsing dos parâmetros de consulta
    const { category_id, page, size } = ParamsSchema.parse(req.query);

    // Instanciando os repositórios e o serviço
    const productRepository = new ProductRepositoryPrisma();
    const categoryRepository = new CategoryRepositoryPrisma();
    const listProductByCategoryService = new ListProductByCategoryService(productRepository, categoryRepository);

    // Chamando o serviço para listar os produtos pela categoria
    const { products, totalPages, error } = await listProductByCategoryService.execute({ categoryId: category_id, page, size });

    // Tratamento de erros
    if (error) {
        if (error instanceof CategoryNotFoundError) {
            return res.status(404).send({ message: error.message });
        }
        return res.status(500).send({ message: "Internal Server Error" });
    }

    // Retornar os produtos, total de páginas e a página atual
    return res.status(200).send({
        products,
        totalPages,
        currentPage: page,
    });
}
