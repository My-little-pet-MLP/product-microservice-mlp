import { Order, Prisma, Product, ProductInOrders } from "@prisma/client";
import { ProductRepostory } from "../product-repository";
import { ProductInOrderRepository } from "../product-in-order-repository";
import { prisma } from "../../lib/prisma";

export class ProductInOrderRepositoryPrisma implements ProductInOrderRepository {
    async listAllByOrder(orderId: string): Promise<ProductInOrders[] | null> {
        const productsInOrder = await prisma.productInOrders.findMany({
            where: {
                orderId,
            }
        })
        return productsInOrder;
    }
    async findById(id: string): Promise<ProductInOrders | null> {
        const productInOrders = await prisma.productInOrders.findFirst({
            where: {
                id,
            }
        })
        return productInOrders;
    }
    async register(data: Prisma.ProductInOrdersUncheckedCreateInput): Promise<ProductInOrders> {
        const productInOrders = await prisma.productInOrders.create({
            data: {
                orderId: data.orderId,
                productId: data.productId,
                quantity: data.quantity,
            }
        })
        return productInOrders;
    }
    async update(id: string, quantity:number): Promise<ProductInOrders | null> {
        const productInOrders = await prisma.productInOrders.update({
            where: {
                id,
            },
            data: {
                quantity: quantity,
            }
        })
        return productInOrders;
    }
    async delete(id: string): Promise<void> {
        await prisma.productInOrders.delete({
            where: {
                id
            },
        })
    }
    async getByOrderAndProductId(orderId: string, productId: string): Promise<ProductInOrders | null> {
        return await prisma.productInOrders.findFirst({
            where: { orderId, productId },
        });
    }

    async updateQuantity(
        orderId: string,
        productId: string,
        quantity: number
    ): Promise<ProductInOrders | null> {
        const existingProductInOrder = await this.getByOrderAndProductId(orderId, productId);
    
        if (!existingProductInOrder) return null;
    
        // Atualiza a quantidade corretamente
        const newQuantity = existingProductInOrder.quantity + quantity;
    
        return await prisma.productInOrders.update({
            where: { id: existingProductInOrder.id },
            data: { quantity: newQuantity, updated_at: new Date() },
        });
    }
    




}