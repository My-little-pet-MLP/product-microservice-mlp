import { Order, Prisma, ProductInOrders } from "@prisma/client";

export interface ProductInOrderRepository {
    listAllByOrder(orderId: string): Promise<ProductInOrders[] | null>
    findById(id: string): Promise<ProductInOrders | null>
    register(data: Prisma.ProductInOrdersUncheckedCreateInput): Promise<ProductInOrders>
    update(id: string, data: Prisma.ProductInOrdersUncheckedUpdateInput): Promise<ProductInOrders | null>
    delete(id: string): Promise<void>
    getByOrderAndProductId(orderId: string, productId: string): Promise<ProductInOrders | null>
    updateQuantity(
        orderId: string,
        productId: string,
        quantity: number
    ): Promise<{ id: string; productId: string; quantity: number; orderId: string; created_at: Date; updated_at: Date } | null>;
    
}