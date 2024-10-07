import { Prisma, Store } from "@prisma/client";

export interface StoreRepository {
    findById(id: string): Promise<Store | null>
    findStoreByUserId(userId:string):Promise<Store|null>
    register( title:string,description:string,cnpj:string,userId:string,imageUrl:string):Promise<Store>
    update(id:string,data:{cnpj:string,imageUrl:string,description:string,title:string}):Promise<Store|null>
    delete(id:string):Promise<void>
}