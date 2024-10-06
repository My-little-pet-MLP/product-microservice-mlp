import { FastifyInstance } from "fastify";
import { ListAllByOrderIdController } from "../controller/product-in-orders/list-all-by-order-id.controller";
import { RegisterProductInOrdersController } from "../controller/product-in-orders/register-product-in-orders.controller";
import { GetProductInOrderByIdController } from "../controller/product-in-orders/get-product-in-order-by-id.controller";
import { UpdateProductInOrdersController } from "../controller/product-in-orders/update-product-in-orders.controller";

export async function ProductInOrdersRouter(app:FastifyInstance) {
    app.get("/listallbyorder/:id",ListAllByOrderIdController)
    app.get("/:id",GetProductInOrderByIdController)

    app.post("/",RegisterProductInOrdersController)

    app.put("/",UpdateProductInOrdersController)
}