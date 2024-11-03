import { Cupom, Prisma } from "@prisma/client";
import { CupomRepository } from "../cupom-repository";
import { prisma } from "../../lib/prisma";

export class CupomRepositoryPrisma implements CupomRepository {
    async getById(id: string): Promise<Cupom | null> {
        const cupom = await prisma.cupom.findFirst({
            where: {
                id
            }
        })
        return cupom;
    }
    async register(data: Prisma.CupomUncheckedCreateInput): Promise<Cupom | null> {
        const cupom = await prisma.cupom.create({
            data
        })
        return cupom;
    }
    async update(id: string, data: Prisma.CupomUncheckedUpdateInput): Promise<Cupom | null> {
        const cupom = await prisma.cupom.update({
            where: {
                id
            },
            data
        })
        return cupom;
    }
    async delete(id: string): Promise<void> {
        await prisma.cupom.update({
            where: {
                id
            },
            data: {
                isValid: false,
            }
        })

    }
    async listByCustomerId(customerId: string): Promise<Cupom[]> {
        const cupons = await prisma.cupom.findMany({
            where: {
                customerId,
                isValid: true
            }
        })
        return cupons;
    }
    async listByStoreId(storeId: string): Promise<Cupom[]> {
        const cupons = await prisma.cupom.findMany({
            where: {
                storeId
            }
        })
        return cupons;
    }
    async listByStoreIdAndCustomerId(customerId: string, storeId: string): Promise<Cupom[]> {
        const cupons = await prisma.cupom.findMany({
            where: {
                customerId,
                storeId,
                isValid: true
            }
        })
        return cupons;
    }

}