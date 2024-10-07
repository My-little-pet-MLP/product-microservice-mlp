import { Order, Prisma } from "@prisma/client";

export interface OrderRepository {
    listAllByCustomerId(customerId:string,page:number,size:number):Promise<Order[]|null>
    getById(id:string):Promise<Order|null>

    register(data:Prisma.OrderUncheckedCreateInput):Promise<Order>
    
    update(id:string,data:Prisma.OrderUncheckedUpdateInput):Promise<Order|null>
    countOrdersByStoreId(storeId: string): Promise<number>
    countOrdersByCustomerId(customerId:string):Promise<number>
}