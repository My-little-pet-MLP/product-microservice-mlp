import { Order, Prisma } from "@prisma/client";

export interface OrderRepository {
    getById(id:string):Promise<Order|null>

    register(data:Prisma.OrderUncheckedCreateInput):Promise<Order>
    
    update(id:string,data:Prisma.OrderUncheckedUpdateInput):Promise<Order|null>

    listByProductId(productId:string,size:number,page:number):Promise<Order[]>

    listByCustomerId(customerId:string,size:number,page:number):Promise<Order[]>
}