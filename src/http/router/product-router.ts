import { FastifyInstance } from "fastify";
import { GetProductByIdController } from "../controller/get-product-by-id.controller";
import { ListProductByCategoryController } from "../controller/list-product-by-category.controller";
import { ListProductByStoreIdController } from "../controller/list-product-by-store-id.controller";
import { RegisterProductController } from "../controller/register-product.controller";
import { UpdateProductController } from "../controller/update-product.controller";


export async function ProductRouter(app:FastifyInstance) {
   app.get("/:id",GetProductByIdController)
   app.get("/listbycategory",ListProductByCategoryController)
   app.get("/listbystore",ListProductByStoreIdController)


   app.post("/",RegisterProductController)

   app.put("/",UpdateProductController)
}