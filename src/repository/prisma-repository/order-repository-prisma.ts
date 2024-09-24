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
            data
        })
        return order;
    }
}