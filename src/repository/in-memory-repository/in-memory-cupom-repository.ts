import { CupomRepository } from "../cupom-repository";
import { Cupom, Prisma } from "@prisma/client";



export class InMemoryCupomRepository implements CupomRepository {
    private cupons: Cupom[] = [];
    async listAllWhereCustomerIdIsNull(): Promise<Cupom[]> {
        return this.cupons.filter(cupom => cupom.customerId === null);
    }

    // Implementação para selecionar um cupom aleatório e atribuir customerId
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
