import { FastifyInstance } from "fastify";
import { ListOrdersByCustomerIdController } from "../controller/list-orders-by-customer-id.controller";
import { GetByIdOrderController } from "../controller/get-by-id-order.controller";
import { ListOrdersByProductIdController } from "../controller/list-orders-by-product-id.controller";
import { RegisterOrderController } from "../controller/register-order.controller";
import { UpdateOrderController } from "../controller/update-order.controller";

export async function OrderRouter(app: FastifyInstance) {
    app.get("/:id", GetByIdOrderController)
    app.get("/listbycustomer", ListOrdersByCustomerIdController)
    app.get("/listbyproduct", ListOrdersByProductIdController)

    app.post("/", RegisterOrderController)
    
    app.put("/",UpdateOrderController)
}