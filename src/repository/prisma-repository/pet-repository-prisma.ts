import { Pet, Prisma } from "@prisma/client";
import { PetRepository } from "../pet-repository";
import { prisma } from "../../lib/prisma";

export class PetRepositoryPrisma implements PetRepository{
    async update(id: string, data: Prisma.PetUncheckedUpdateInput): Promise<Pet | null> {
       const pet = await prisma.pet.update({
        where:{
            id,
        },
        data,
       })
       return pet;
    }
    async findById(id: string): Promise<Pet | null> {
       const pet = await prisma.pet.findFirst({
        where:{
            id,
        }
       })
       return pet;
    }
    async register(data: Prisma.PetUncheckedCreateInput): Promise<Pet> {
        const pet = await prisma.pet.create({
            data,
        })
        return pet;
    }
    async delete(id: string): Promise<void> {
        await prisma.pet.update({
            where:{
                id,
            },
            data:{
                isActive:false,
            }
        })
        return ;
    }
    async listAllByUserId(customerId: string): Promise<Pet[]> {
        const pets = await prisma.pet.findMany({
            where:{
                customerId,
                isActive:true
            }
        })
        return pets;
    }

}