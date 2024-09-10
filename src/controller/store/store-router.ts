import { FastifyInstance } from "fastify";
import { RegisterStoreController } from "./register-store.controller";
import { GetStoreByUserIdController } from "./get-store-by-user-id.controller";
import { RegisterProductController } from "./product/register-product.controller";
import { ListCategoryController } from "./product/category/list-category.controller";
import { RegisterCategoryController } from "./product/category/register-category.controller";
import { ListProductByStoreIdController } from "./product/list-product-by-store-id.controller";
import { GetProductByIdController } from "./product/get-product-by-id.controller";

export async function StoreRouter(app: FastifyInstance) {

    // Rota para registrar uma nova loja
    // Exemplo de URL: POST http://localhost:3333/api/store
    app.post("/", RegisterStoreController);

    // Rota para obter uma loja pelo ID do usuário
    // Exemplo de URL: GET http://localhost:3333/api/store/userid/${user_id}
    app.get("/userid/:user_id", GetStoreByUserIdController);

    // Rota para registrar um novo produto
    // Exemplo de URL: POST http://localhost:3333/api/store/product
    app.post("/product/", RegisterProductController);

    // Rota para listar produtos por ID da loja com paginação
    // Parâmetros "page", "size", e "store_id" são enviados via query string
    // Exemplo de URL: GET http://localhost:3333/api/store/product/listproductbystoreid?store_id=${store_id}&page=${page}&size=${size}
    app.get("/product/listproductbystoreid", ListProductByStoreIdController);

    // Rota para obter um produto específico pelo ID do produto
    // Exemplo de URL: GET http://localhost:3333/api/store/product/id/${id}
    app.get("/product/id/:id", GetProductByIdController);

    // Rota para listar todas as categorias de produtos
    // Exemplo de URL: GET http://localhost:3333/api/store/product/category
    app.get("/product/category", ListCategoryController);

    // Rota para registrar uma nova categoria de produto
    // Exemplo de URL: POST http://localhost:3333/api/store/product/category
    app.post("/product/category", RegisterCategoryController);
}
