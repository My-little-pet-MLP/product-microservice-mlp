import { CupomRepository } from "../cupom-repository";
import { Prisma } from "@prisma/client";

// Defining the type Cupom as per your Prisma model
export type Cupom = {
    id: string;
    description:string;
    porcentagem: number;
    createdAt: Date;
    ValidateAt: Date;
    isValid: boolean;
    storeId: string;
    customerId: string;
};

export class InMemoryCupomRepository implements CupomRepository {
    private cupons: Cupom[] = [];

    async getById(id: string): Promise<Cupom | null> {
        const cupom = this.cupons.find(c => c.id === id) || null;
        return cupom;
    }

    async register(data: Prisma.CupomUncheckedCreateInput): Promise<Cupom | null> {
        const newCupom: Cupom = {
            id: data.id ?? `test-id-${Math.random().toString(36).substr(2, 9)}`,
            porcentagem: data.porcentagem!,
            description:data.description,
            createdAt: data.createdAt as Date,
            ValidateAt: data.ValidateAt as Date,
            isValid: data.isValid ?? false,
            storeId: data.storeId!,
            customerId: data.customerId!
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
            ...data
        } as Cupom;

        return this.cupons[index];
    }

    async delete(id: string): Promise<void> {
        const index = this.cupons.findIndex(c => c.id === id);
        if (index !== -1) {
            this.cupons[index].isValid = false;
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
}
