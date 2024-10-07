import { Prisma, Store } from "@prisma/client";
import { StoreRepository } from "../store-repository";
import { prisma } from "../../lib/prisma";

export class StoreRepositoryPrisma implements StoreRepository {
    async delete(id: string): Promise<void> {
       await prisma.store.update(
       {
        where:{
            id,
        },
        data:{
            isActive:false
        }
       }
       )
    }
    
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
    async register(title:string,description:string,cnpj:string,userId:string,imageUrl:string): Promise<Store> {
        const storeRegister = await prisma.store.create({
            data:{
                title,
                description,
                cnpj,
                userId,
                imageUrl
            }
        })
        return storeRegister;
    }

    async update(id: string, data:{cnpj:string,imageUrl:string,description:string,title:string}): Promise<Store | null> {
        const storeUpdate = await prisma.store.update({
            where:{
                id
            },
            data:{
                title:data.title,
                description:data.description,
                imageUrl:data.imageUrl,
                cnpj:data.cnpj,
            }
        })
        return storeUpdate;
    }
    
}