import { CupomRepository } from "../cupom-repository";
import { Cupom, Prisma } from "@prisma/client";

export class InMemoryCupomRepository implements CupomRepository {
    private cupons: Cupom[] = [];

    async listAllWhereCustomerIdIsNull(): Promise<Cupom[]> {
        return this.cupons.filter(cupom => cupom.customerId === null);
    }

    async listAllWhereCustomerIdIsNullByStoreId(storeId: string): Promise<Cupom[]> {
        return this.cupons.filter(cupom => cupom.customerId === null && cupom.storeId === storeId);
    }

    async listAllCouponByStore(storeId: string): Promise<Cupom[]> {
        // Filtrar cupons únicos por descrição
        const uniqueDescriptions = new Set<string>();
        return this.cupons.filter(cupom => {
            if (cupom.storeId === storeId && !uniqueDescriptions.has(cupom.description)) {
                uniqueDescriptions.add(cupom.description);
                return true;
            }
            return false;
        });
    }

    async countCouponWhereCustomerIdIsNullAndStoreId(storeId: string, description: string): Promise<number> {
        return this.cupons.filter(cupom => cupom.storeId === storeId && cupom.customerId === null && cupom.description === description).length;
    }

    async countCouponWhereCustomerIdNotNullAndStoreId(storeId: string, description: string): Promise<number> {
        return this.cupons.filter(cupom => cupom.storeId === storeId && cupom.customerId !== null && cupom.description === description).length;
    }

    async countCouponWhereDescription(description: string): Promise<number> {
        return this.cupons.filter(cupom => cupom.description === description).length;
    }

    async getById(id: string): Promise<Cupom | null> {
        return this.cupons.find(c => c.id === id) || null;
    }

    async register(data: Prisma.CupomUncheckedCreateInput): Promise<Cupom | null> {
        const newCupom: Cupom = {
            id: data.id ?? `test-id-${Math.random().toString(36).substr(2, 9)}`,
            porcentagem: data.porcentagem!,
            description: data.description!,
            createdAt: new Date(data.createdAt!),
            ValidateAt: new Date(data.ValidateAt!),
            isValid: data.isValid ?? false,
            storeId: data.storeId!,
            customerId: data.customerId ?? null
        };
        this.cupons.push(newCupom);
        return newCupom;
    }

    async update(id: string, data: Prisma.CupomUncheckedUpdateInput): Promise<Cupom | null> {
        const index = this.cupons.findIndex(c => c.id === id);
        if (index === -1) {
            return null;
        }

        this.cupons[index] = {
            ...this.cupons[index],
            ...data,
            id: this.cupons[index].id // Garante que o ID original não será sobrescrito
        } as Cupom;

        return this.cupons[index];
    }

    async delete(id: string): Promise<void> {
        const index = this.cupons.findIndex(c => c.id === id);
        if (index !== -1) {
            this.cupons.splice(index, 1);
        }
    }

    async listByCustomerId(customerId: string): Promise<Cupom[]> {
        return this.cupons.filter(c => c.customerId === customerId && c.isValid);
    }

    async listByStoreId(storeId: string): Promise<Cupom[]> {
        return this.cupons.filter(c => c.storeId === storeId);
    }

    async listByStoreIdAndCustomerId(customerId: string, storeId: string): Promise<Cupom[]> {
        return this.cupons.filter(c => c.customerId === customerId && c.storeId === storeId && c.isValid);
    }

    async GrantCouponToCustomer(customerId: string): Promise<Cupom | null> {
        const cuponsDisponiveis = await this.listAllWhereCustomerIdIsNull();

        if (cuponsDisponiveis.length === 0) {
            return null; // Nenhum cupom disponível
        }

        // Selecionar um cupom aleatório
        const randomIndex = Math.floor(Math.random() * cuponsDisponiveis.length);
        const selectedCupom = cuponsDisponiveis[randomIndex];

        // Atualizar o cupom com o novo customerId
        selectedCupom.customerId = customerId;

        return selectedCupom;
    }
}
