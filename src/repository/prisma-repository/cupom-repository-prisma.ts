import { Cupom, Prisma } from "@prisma/client";
import { CupomRepository } from "../cupom-repository";
import { prisma } from "../../lib/prisma";

export class CupomRepositoryPrisma implements CupomRepository {
    async countCouponWhereDescription(description: string): Promise<number> {
        const numbercupomExists = await prisma.cupom.findMany({
            where: {
                description,
            },

        });
        return numbercupomExists.length;
    }
    async listAllCouponByStore(storeId: string): Promise<Cupom[]> {
        const uniqueCupons = await prisma.cupom.findMany({
            where: {
                storeId: storeId
            },
            distinct: ['description'] // Garante que as descrições sejam únicas
        });
        return uniqueCupons;
    }

    async countCouponWhereCustomerIdNotNullAndStoreId(storeId: string, description: string): Promise<number> {
        const cupons = await prisma.cupom.findMany({
            where: {
                customerId: {
                    not: null,
                },
                description: description
            },
        });
        console.log(cupons);

        const cuponsFinal = await prisma.cupom.findMany({
            where: {
                customerId: {
                    not: null,
                },
                description: description,
                storeId,
            },
        });
        console.log(cuponsFinal.length);


        return cuponsFinal.length
    }
    async countCouponWhereCustomerIdIsNullAndStoreId(storeId: string, description: string): Promise<number> {
        const cupons = await prisma.cupom.findMany({
            where: {
                customerId: null,
                description: description,
                storeId
            }
        })
        return cupons.length;
    }
    async listAllWhereCustomerIdIsNullByStoreId(storeId: string): Promise<Cupom[]> {
        const cupons = await prisma.cupom.findMany({
            where: {
                customerId: null,
                storeId
            }
        })
        return cupons;
    }

    async listAllWhereCustomerIdIsNull(): Promise<Cupom[]> {
        const cupons = await prisma.cupom.findMany({
            where: {
                customerId: null
            }
        })
        return cupons;
    }
    async GrantCouponToCustomer(customerId: string): Promise<Cupom | null> {
        // Obter todos os cupons onde customerId é null
        const cupons = await this.listAllWhereCustomerIdIsNull();

        // Verificar se existem cupons disponíveis
        if (cupons.length === 0) {
            return null;
        }

        // Selecionar um cupom aleatório
        const randomIndex = Math.floor(Math.random() * cupons.length);
        const selectedCupom = cupons[randomIndex];

        // Atualizar o customerId no cupom selecionado
        const updatedCupom = await prisma.cupom.update({
            where: { id: selectedCupom.id },
            data: { customerId }
        });

        return updatedCupom;

    }
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