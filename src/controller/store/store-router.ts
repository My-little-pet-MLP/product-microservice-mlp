import { FastifyInstance } from "fastify";
import { RegisterStoreController } from "./register-store.controller";
import { GetStoreByUserIdController } from "./get-store-by-user-id.controller";
import { RegisterProductController } from "./product/register-product.controller";
import { ListCategoryController } from "./product/category/list-category.controller";
import { RegisterCategoryController } from "./product/category/register-category.controller";
import { ListProductByStoreIdController } from "./product/list-product-by-store-id.controller";
import { GetProductByIdController } from "./product/get-product-by-id.controller";

export async function StoreRouter(app:FastifyInstance) {

    //Store router
    app.post("/",RegisterStoreController)
    app.get("/userid/:user_id",GetStoreByUserIdController)


    // product Router
    app.post("/product/",RegisterProductController)
    app.get("/product/listproductbyid",ListProductByStoreIdController)
    app.get("product/id/:id",GetProductByIdController)

    // category product Router
    app.get("/product/category",ListCategoryController)
    app.post("/product/category",RegisterCategoryController)
}