import { FastifyInstance } from "fastify";
import { GetByIdCategoryController } from "../controller/categories/get-by-id-category.controller";
import { ListAllCategoryController } from "../controller/categories/list-all-category.controller";
import { RegisterCategoryController } from "../controller/categories/register-category.controller";

export async function CategoryRouter(app: FastifyInstance) {
    app.get("/:id", GetByIdCategoryController)
    app.get("/", ListAllCategoryController)
    app.post("/",RegisterCategoryController)
}