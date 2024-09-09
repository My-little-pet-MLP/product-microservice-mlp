import { Store } from "@prisma/client";

export interface StoreRepository {
    findById(id: string): Promise<Store | null>
    findStoreByUserId(userId:string):Promise<Store|null>
    register( title:string,description:string,cnpj:string,userId:string):Promise<Store>
  
}