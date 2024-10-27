import { Pet, Prisma } from "@prisma/client";

export interface PetRepository {
    findById(id: string): Promise<Pet | null>
    register(data: Prisma.PetUncheckedCreateInput): Promise<Pet>

    delete(id: string): Promise<void>
    listAllByUserId(customerId: string): Promise<Pet[]>
}