import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { OrderRepositoryPrisma } from "../../repository/prisma-repository/order-repository-prisma";
import { UpdateOrderService } from "../../service/order/update-order.service";
import { ProductRepositoryPrisma } from "../../repository/prisma-repository/product-repository-prisma";
import { ProductNotFoundError } from "../../service/error/product-not-found-error";
import { InvalidStatusError } from "../../service/error/invalid-status-error";

export async function UpdateOrderController(req:FastifyRequest,res:FastifyReply) {
    const bodySchema = z.object({
        id:z.string(),
        products_id: z.array(z.string()),
        status: z.enum(["pending","awaiting_payment","payment_confirmed","processing","shipped","delivered","canceled","returned"])
    })

    const {id,products_id,status} = bodySchema.parse(req.body);

    const orderRepository = new OrderRepositoryPrisma();
    const productRepository = new ProductRepositoryPrisma();
    const updateOrderService = new UpdateOrderService(orderRepository,productRepository);


    
    const {order,error} = await updateOrderService.execute({id,productsid:products_id,status});

    if(error){
        if(error instanceof InvalidStatusError){
            return res.status(400).send({message:error.message})
        }
        if(error instanceof ProductNotFoundError){
            return res.status(404).send({message:error.message})
        }
        console.log("Internal Server Error UpdateOrderController: "+ error.message)
        return res.status(500).send({message:"Internal Server Error"})
    }
    return res.status(200).send(order)
}