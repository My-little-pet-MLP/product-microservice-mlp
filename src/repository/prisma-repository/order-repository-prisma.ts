import { Order, OrderStatus, Prisma } from "@prisma/client";
import { OrderRepository } from "../order-repository";
import { prisma } from "../../lib/prisma";

export class OrderRepositoryPrisma implements OrderRepository {
    async delete(id: string): Promise<void> {
        await prisma.order.delete({
            where: { id }
        })
    }
    async TotalSalesInMonthCount(storeId: string): Promise<number> {
        const validStatuses: OrderStatus[] = [
            OrderStatus.processing,
            OrderStatus.shipped,
            OrderStatus.delivered
        ];

        // Obter o primeiro e último dia do mês atual
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

        const orders = await prisma.order.findMany({
            where: {
                storeId,
                status: {
                    in: validStatuses,
                },
                updated_at: {
                    gte: startOfMonth,
                    lte: endOfMonth,
                }
            },
            select: {
                fullPriceOrderInCents: true,
            }
        });

        const totalSalesInMonthCount = orders.length;

        return totalSalesInMonthCount;
    }
    async TotalBillingMonthSome(storeId: string): Promise<number> {
        const validStatuses: OrderStatus[] = [
            OrderStatus.processing,
            OrderStatus.shipped,
            OrderStatus.delivered
        ];

        // Obter o primeiro e último dia do mês atual
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

        const orders = await prisma.order.findMany({
            where: {
                storeId,
                status: {
                    in: validStatuses,
                },
                updated_at: {
                    gte: startOfMonth,
                    lte: endOfMonth,
                }
            },
            select: {
                fullPriceOrderInCents: true,
            }
        });

        const total = orders.reduce((acc, order) => acc + order.fullPriceOrderInCents, 0);

        return total;
    }

    async listAllByStoreId(
        storeId: string,
        page: number,
        size: number
    ): Promise<Order[] | null> {
        const skip = (page - 1) * size;
        const take = size;

        const validStatuses: OrderStatus[] = [
            OrderStatus.processing,
            OrderStatus.shipped,
            OrderStatus.delivered,
            OrderStatus.payment_confirmed
        ];

        const orders = await prisma.order.findMany({
            where: {
                storeId,
                status: {
                    in: validStatuses,
                },
            },
            orderBy: {
                updated_at: "desc",
            },
            skip,
            take,
        });

        return orders;
    }

    async confirmOrder(id: string, fullPriceOrderInCents: number): Promise<Order | null> {
        const order = await prisma.order.update({
            where: {
                id,
            },
            data: {
                status: "payment_confirmed",
                fullPriceOrderInCents,
            }
        })
        return order
    }
    async verifyCustomerHavePedingOrder(customerId: string, storeId: string): Promise<Order | null> {
        return await prisma.order.findFirst({
            where: {
                customerId,
                status: "pending",
                storeId
            }
        })
    }

    async countOrdersByCustomerId(customerId: string): Promise<number> {
        return await prisma.order.count({
            where: {
                customerId,

            }
        });
    }
    async countOrdersByStoreId(storeId: string): Promise<number> {
        return await prisma.order.count({
            where: {
                storeId: storeId,

            }
        });
    }
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
                status: {
                    in: ["pending", "awaiting_payment", "processing", "shipped"], // Status que indicam que o pedido não foi finalizado
                },
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
    async updateFullPrice(orderId: string, newFullPrice: number): Promise<void> {
        await prisma.order.update({
            where: { id: orderId },
            data: { fullPriceOrderInCents: newFullPrice },
        });
    }
}