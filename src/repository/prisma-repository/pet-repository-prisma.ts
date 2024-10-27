import { Pet, Prisma } from "@prisma/client";
import { PetRepository } from "../pet-repository";

export class PetRepositoryPrisma implements PetRepository{
    async findById(id: string): Promise<Pet | null> {
        throw new Error("Method not implemented.");
    }
    async register(data: Prisma.PetUncheckedCreateInput): Promise<Pet> {
        throw new Error("Method not implemented.");
    }
    async delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async listAllByUserId(customerId: string): Promise<Pet[]> {
        throw new Error("Method not implemented.");
    }

}