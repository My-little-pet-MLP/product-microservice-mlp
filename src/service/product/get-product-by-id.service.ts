import { Product } from "@prisma/client";
import { ProductRepostory } from "../../repository/product-repository";
import { ProductNotFoundError } from "../error/product-not-found-error";


interface GetProductByIdServiceRequest{
    id: string;
}
interface GetProductByIdServiceReply{
    product:Product|null;
    error: Error|null;
}

export class GetProductByIdService {
    constructor(private productRepository:ProductRepostory){}

    async execute({id}:GetProductByIdServiceRequest):Promise<GetProductByIdServiceReply>{
        const product = await this.productRepository.getById(id);
        if(!product){
            return {product:null,error: new ProductNotFoundError}
        }
        return {product,error:null};
    }
} 