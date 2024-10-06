import { FastifyInstance } from "fastify";

import { GetByIdOrderController } from "../controller/orders/get-by-id-order.controller";
import { ListAllOrdersByCustomerIdController } from "../controller/orders/list-all-order-by-customer-id.controller";
import { RegisterOrderController } from "../controller/orders/register-order.controller";
import { UpdateOrderController } from "../controller/orders/update-order.controller";



export async function OrderRouter(app: FastifyInstance) {
    app.get("/:id", GetByIdOrderController)
    app.get("/listAllByCustomerId",ListAllOrdersByCustomerIdController)

    app.post("/",RegisterOrderController)


    app.put("/",UpdateOrderController)
}