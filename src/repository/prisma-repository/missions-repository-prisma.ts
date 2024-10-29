import { Missao, Prisma } from "@prisma/client";
import { MissionsRepository } from "../missions-repository";
import { prisma } from "../../lib/prisma";

export class MissionsRepositoryPrisma implements MissionsRepository {
    async findById(id: string): Promise<Missao | null> {
        const mission = await prisma.missao.findFirst({
            where:{
                id,
            }
        })
        return mission;
    }
   async  register(data: Prisma.MissaoUncheckedCreateInput): Promise<Missao | null> {
       const mission = await prisma.missao.create({
        data,
       })
       return mission;
    }
    async updateComplete(id: string): Promise<Missao | null> {
       const mission = await prisma.missao.update({
        where:{
            id,
        },
        data:{
            concluido:true,
        }
       })
       return mission;
    }
    async update(id: string, data: Prisma.MissaoUncheckedUpdateInput): Promise<Missao | null> {
       const mission = await prisma.missao.update({
        where:{
            id,
        },
        data,
       })
       return mission;
    }
    async listAllByCustomerIdUncomplete(customerId: string): Promise<Missao[]> {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0); // Início do dia
    
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999); // Fim do dia
    
        const missions = await prisma.missao.findMany({
            where: {
                customerId,
                concluido: false,
                createdAt: {
                    gte: startOfDay, // Maior ou igual ao início do dia
                    lt: endOfDay,    // Menor que o fim do dia
                },
            },
        });
    
        return missions;
    }
    
    async listAllByCustomerId(customerId: string): Promise<Missao[]> {
        throw new Error("Method not implemented.");
    }
    
}