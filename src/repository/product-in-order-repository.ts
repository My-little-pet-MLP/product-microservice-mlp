import { Order, Prisma } from "@prisma/client";

export interface ProductInOrderRepository{
    listAllByOrder(orderId:string):Promise<Order[]|null>
    findById(id:string):Promise<Order|null>
    register(data:Prisma.ProductInOrdersUncheckedCreateInput):Promise<Order|null>
    update(data:Prisma.ProductInOrdersUncheckedUpdateInput):Promise<Order|null>
    delete(id:string):Promise<void>
}