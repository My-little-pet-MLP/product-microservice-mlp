import { Order, Prisma } from "@prisma/client";

export interface OrderRepository {
    listAllByCustomerId(customerId: string, page: number, size: number): Promise<Order[] | null>
    getById(id: string): Promise<Order | null>

    register(data: Prisma.OrderUncheckedCreateInput): Promise<Order>

    update(id: string, data: Prisma.OrderUncheckedUpdateInput): Promise<Order | null>
    countOrdersByStoreId(storeId: string): Promise<number>
    countOrdersByCustomerId(customerId: string): Promise<number>

    verifyCustomerHavePedingOrder(customerId: string,storeId:string): Promise<Order | null>
    
    listAllByStoreId(storeId:string, page: number, size: number):Promise<Order[]|null>

    confirmOrder(id:string,fullPriceOrderInCents:number):Promise<Order|null>

    updateFullPrice(orderId: string, newFullPrice: number): Promise<void>

    TotalBillingMonthSome(storeId:string):Promise<number>

    TotalSalesInMonthCount(storeId:string):Promise<number>
}