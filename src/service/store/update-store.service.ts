import { Store } from "@prisma/client";
import { StoreRepository } from "../../repository/store-repository";
import { StoreNotFoundError } from "../error/store-not-found-error";

interface UpdateStoreServiceRequest {
    id:string;
    title: string;
    description: string;
    cnpj: string;
    imageUrl: string;
}
interface UpdateStoreServiceResponse {
    store: Store | null;
    error: Error | null;
}

export class UpdateStoreService {
    constructor(private storeRepository: StoreRepository) { }

    async execute({ id,title, description, cnpj, imageUrl }: UpdateStoreServiceRequest): Promise<UpdateStoreServiceResponse> {

        const storeExists = await this.storeRepository.findById(id);
        if(!storeExists){
            return {store:null,error: new StoreNotFoundError}
        }
        const storeUpdated = await this.storeRepository.update(id,{title,description,cnpj,imageUrl})

        return {store:storeUpdated,error:null}
    }
}