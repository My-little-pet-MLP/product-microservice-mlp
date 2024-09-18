import { FastifyInstance } from "fastify";
import { GetByIdCategoryController } from "../controller/get-by-id-category.controller";
import { ListAllCategoryController } from "../controller/list-all-category.controller";
import { RegisterCategoryController } from "../controller/register-category.controller";

export async function CategoryRouter(app: FastifyInstance) {
    app.get("/:id", GetByIdCategoryController)
    app.get("/", ListAllCategoryController)
    app.post("/",RegisterCategoryController)
}