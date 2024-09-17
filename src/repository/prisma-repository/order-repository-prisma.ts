import { Order, Prisma } from "@prisma/client";
import { OrderRepository } from "../order-repository";
import { prisma } from "../../lib/prisma";

export class OrderRepositoryPrisma implements OrderRepository {
    async getById(id: string): Promise<Order | null> {
        const order = await prisma.order.findFirst({
            where: {
                id,
            }
        })
        return order;
    }

    async register(data: Prisma.OrderUncheckedCreateInput): Promise<Order> {
        const order = await prisma.order.create({
            data,
        })
        return order;
    }

    async update(id: string, data: Prisma.OrderUncheckedUpdateInput): Promise<Order | null> {
        const order = await prisma.order.update({
            where: {
                id,
            },
            data: {
                fullPriceOrderInCents: data.fullPriceOrderInCents,
                status: data.status,
                Products: data.Products
            }
        })
        return order;
    }

    async listByProductId(productId: string, size: number, page: number): Promise<Order[]> {
        const skip = (page - 1) * size;
        const orders = await prisma.order.findMany({
            where: {
                Products: {
                    some: {
                        id: productId
                    }
                }
            },
            skip: skip,
            take: size,
        });
        return orders;
    }

    async listByCustomerId(customerId: string, size: number, page: number): Promise<Order[]> {
        const skip = (page - 1) * size;
        const orders = await prisma.order.findMany({
            where: {
                customerId,
            },
            skip: skip,
            take: size,
        })
        return orders;
    }

}