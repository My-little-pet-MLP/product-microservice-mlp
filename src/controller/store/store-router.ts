import { FastifyInstance } from "fastify";
import { RegisterStoreController } from "./register-store.controller";
import { GetStoreByUserIdController } from "./get-store-by-user-id.controller";
import { RegisterProductController } from "./product/register-product.controller";
import { ListCategoryController } from "./product/category/list-category.controller";

export async function StoreRouter(app:FastifyInstance) {

    //Store router
    app.post("/",RegisterStoreController)
    app.get("/userId/:userId",GetStoreByUserIdController)


    // product Router
    app.post("/product/",RegisterProductController)


    app.get("/product/category",ListCategoryController)
}