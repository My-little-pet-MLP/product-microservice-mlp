import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { StoreRepositoryPrisma } from "../../../repository/prisma-repository/store-repository-prisma";
import { OrderRepositoryPrisma } from "../../../repository/prisma-repository/order-repository-prisma";
import { TotalBillingMonthSomeService } from "../../../service/order/total-billing-month-some.service";
import { StoreNotFoundError } from "../../../service/error/store-not-found-error";

export async function TotalBillingMonthSomeController(req:FastifyRequest,res:FastifyReply) {
    const TotalBillingMonthSomeControllerParamsSchema = z.object({
        store_id:z.string().min(1,"store_id is required")
    })

    const {store_id} = TotalBillingMonthSomeControllerParamsSchema.parse(req.params)

    const storeRepository = new StoreRepositoryPrisma();
    const orderRepository = new OrderRepositoryPrisma();

    const totalBillingMonthSomeService = new TotalBillingMonthSomeService(storeRepository,orderRepository);

    const {total,error} = await totalBillingMonthSomeService.execute({storeId:store_id});

    if(error){
        if(error instanceof StoreNotFoundError){
            return res.status(404).send({message:error.message})
        }
        console.log("Internal Server Error in TotalBillingMonthSomeController: " + error.message)
        return res.status(500).send({message:"Internal Server Error"})
    }
    return res.status(200).send({totalBillingMonth:total})
}