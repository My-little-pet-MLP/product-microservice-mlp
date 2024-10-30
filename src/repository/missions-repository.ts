import { Missao, Prisma } from "@prisma/client";

export interface MissionsRepository {
    findById(id: string): Promise<Missao | null>

    register(data: Prisma.MissaoUncheckedCreateInput): Promise<Missao | null>

    updateComplete(id: string): Promise<Missao | null>

    update(id: string, data: Prisma.MissaoUncheckedUpdateInput): Promise<Missao | null>

    listAllByCustomerIdUncomplete(customerId: string): Promise<Missao[]>

    listAllByCustomerId(customerId: string): Promise<Missao[]>
}