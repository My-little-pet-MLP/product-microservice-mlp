import { FastifyInstance } from "fastify";
import { GetProductByIdController } from "../controller/product/get-product-by-id.controller";
import { ListProductByCategoryController } from "../controller/product/list-product-by-category.controller";
import { ListProductByStoreIdController } from "../controller/product/list-product-by-store-id.controller";
import { RegisterProductController } from "../controller/product/register-product.controller";
import { UpdateProductController } from "../controller/product/update-product.controller";


export async function ProductRouter(app:FastifyInstance) {
   app.get("/:id",GetProductByIdController)
   app.get("/listbycategory",ListProductByCategoryController)
   app.get("/listbystore",ListProductByStoreIdController)


   app.post("/",RegisterProductController)

   app.put("/",UpdateProductController)
}