import { Cupom, Prisma } from "@prisma/client";

export interface CupomRepository {
    getById(id: string): Promise<Cupom | null>
    register(data: Prisma.CupomUncheckedCreateInput): Promise<Cupom | null>
    update(id: string, data: Prisma.CupomUncheckedUpdateInput): Promise<Cupom | null>
    delete(id: string): Promise<void>

    listByCustomerId(customerId: string): Promise<Cupom[]>
    listByStoreId(storeId: string): Promise<Cupom[]>

    listByStoreIdAndCustomerId(customerId: string, storeId: string): Promise<Cupom[]>
}