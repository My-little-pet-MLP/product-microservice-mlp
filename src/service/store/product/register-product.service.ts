import { Product } from "@prisma/client";
import { prisma } from "../../../lib/prisma";
import { ProductRepostory } from "../../../repository/product-repository";
import { StoreNotFoundError } from "../../error/store-not-found-error";
import { UnRegisterCategoryError } from "../../error/unregister-category-error";
import { ErrorRegisteringProductError } from "../../error/error-registering-product-error";

interface RegisterProductServiceRequest{
    title: string;
    imageUrl:string;
    description:string;
    priceInCents:number;
    stock:number;
    categoryId:string;
    storeId:string;
}
interface RegisterProductServiceResponse{
    productRegister: Product
}

export class RegisterProductService {
    constructor(private productRepository:ProductRepostory){}

    async execute({title,imageUrl,description,priceInCents,stock,categoryId,storeId}:RegisterProductServiceRequest):Promise<RegisterProductServiceResponse>{

        const storeExists = await prisma.store.findFirst({
            where:{
                id:storeId
            }
        });
        if (!storeExists){
            console.log(StoreNotFoundError);
            throw new StoreNotFoundError;
        }
        
        const categoryExists = await prisma.category.findFirst({
            where:{
                id:categoryId
            }
        });
        if(!categoryExists){
            console.log(UnRegisterCategoryError);
            throw new UnRegisterCategoryError;
        }

        const productRegister = await this.productRepository.register({
                title,
                imageUrl,
                description,
                priceInCents,
                stock,
                categoryId,
                storeId,
        })
        if (!productRegister){
            console.log(ErrorRegisteringProductError);
            throw new ErrorRegisteringProductError;
        }
        return {productRegister};
    }
}