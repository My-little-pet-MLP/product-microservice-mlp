import { Store } from "@prisma/client";
import { StoreRepository } from "../store-repository";
import { prisma } from "../../lib/prisma";

export class StoreRepositoryPrisma implements StoreRepository {
    async findById(id: string): Promise<Store | null> {
       const store = await prisma.store.findFirst({
        where:{
            id
        }
       })
       return store;
    }
    async findStoreByUserId(userId: string): Promise<Store | null> {
        const store = await prisma.store.findFirst({
            where:{
                userId
            }
           })
           return store;
    }
    async register(title:string,description:string,cnpj:string,userId:string): Promise<Store> {
        const storeRegister = await prisma.store.create({
            data:{
                title,
                description,
                cnpj,
                userId
            }
        })
        return storeRegister;
    }
    
}