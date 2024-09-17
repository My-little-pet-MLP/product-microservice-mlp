import { Store } from "@prisma/client";
import { clerkClient } from "../../lib/cleark";
import { StoreRepository } from "../../repository/store-repository";
import { UserNotFoundError } from "../error/user-not-found-error";

interface RegisterStoreServiceRequest{
    title:string;
    description:string;
    cnpj:string;
    userId:string;
    imageUrl:string;
}
interface RegisterStoreServiceResponse{
    storeRegister:Store|null;
    error:Error|null;
}

export class RegisterStoreService{
    constructor(private storeRepository:StoreRepository){}

    async execute({title,description,cnpj,userId,imageUrl}:RegisterStoreServiceRequest):Promise<RegisterStoreServiceResponse>{


        const userExists = await clerkClient.users.getUser(userId);
        if(!userExists){
            console.log(UserNotFoundError)
            return {storeRegister:null,error:new UserNotFoundError}
        }

        const storeRegister = await this.storeRepository.register(
                 
                title,
                description,
                cnpj,
                userId,
                imageUrl
        )
        
        return {storeRegister,error:null}
    }
}