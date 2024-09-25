import { FastifyInstance } from "fastify";
import { GetStoreByIdController } from "../controller/store/get-store-by-id.controller";
import { GetStoreByUserIdController } from "../controller/store/get-store-by-user-id.controller";
import { RegisterStoreController } from "../controller/store/register-store.controller";
import { UpdateStoreController } from "../controller/store/update-store.controller";

export async function StoreRouter(app:FastifyInstance) {
    app.get("/:id",GetStoreByIdController)
    app.get("/getbyuser/:user_id",GetStoreByUserIdController)
    
    app.post("/",RegisterStoreController);

    app.put("/",UpdateStoreController)
}