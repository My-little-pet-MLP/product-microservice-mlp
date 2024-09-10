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

function generateSlug(title: string): string {
    return title
        .toLowerCase() // converte para minúsculas
        .normalize("NFD") // decompõe caracteres acentuados
        .replace(/[\u0300-\u036f]/g, "") // remove acentos
        .replace(/\s+/g, '-') // substitui espaços por hífens
        .replace(/[^\w-]+/g, '') // remove caracteres especiais
        .replace(/--+/g, '-') // substitui múltiplos hífens por um único hífen
        .replace(/^-+/, '') // remove hífen do início
        .replace(/-+$/, ''); // remove hífen do final
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

        const slug = generateSlug(title);
        const productRegister = await this.productRepository.register({
                title,
                imageUrl,
                slug,
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