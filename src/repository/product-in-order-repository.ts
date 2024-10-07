import { Order, Prisma, ProductInOrders } from "@prisma/client";

export interface ProductInOrderRepository {
    listAllByOrder(orderId: string): Promise<ProductInOrders[] | null>
    findById(id: string): Promise<ProductInOrders | null>
    register(data: Prisma.ProductInOrdersUncheckedCreateInput): Promise<ProductInOrders | null>
    update(id: string, data: Prisma.ProductInOrdersUncheckedUpdateInput): Promise<ProductInOrders | null>
    delete(id: string): Promise<void>
}