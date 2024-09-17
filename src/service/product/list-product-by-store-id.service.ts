import { Product } from "@prisma/client";
import { ProductRepostory } from "../../repository/product-repository";


interface ListProductByStoreIdServiceRequest{
    storeId:string;
    page:number;
    size:number;
}
interface ListProductByStoreIdServiceReply{
    products:Product[]
}

export class ListProductByStoreIdService{
    constructor(private productRepository:ProductRepostory){}

    async execute({storeId,page,size}:ListProductByStoreIdServiceRequest):Promise<ListProductByStoreIdServiceReply>{
        const products = await this.productRepository.listProductsByStoreId(storeId,page,size);
        
        return{products};
    }
}