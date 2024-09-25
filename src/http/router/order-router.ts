import { FastifyInstance } from "fastify";

import { GetByIdOrderController } from "../controller/orders/get-by-id-order.controller";



export async function OrderRouter(app: FastifyInstance) {
    app.get("/:id", GetByIdOrderController)
}