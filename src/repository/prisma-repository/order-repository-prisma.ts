import { Order, Prisma } from "@prisma/client";
import { OrderRepository } from "../order-repository";
import { prisma } from "../../lib/prisma";

export class OrderRepositoryPrisma implements OrderRepository {
    async listAllByCustomerId(
        customerId: string, 
        page: number,
        size: number
    ): Promise<Order[] | null> {
        const skip = (page - 1) * size; 
        const take = size;  
    
        const orders = await prisma.order.findMany({
            where: {
                customerId,
            },
            orderBy: {
                updated_at: "desc",
            },
            skip,   
            take,  
        });
    
        return orders;
    }
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