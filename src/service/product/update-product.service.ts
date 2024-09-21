import { Product } from "@prisma/client";
import { ProductRepostory } from "../../repository/product-repository";
import { ProductNotFoundError } from "../error/product-not-found-error";
import { generateSlug } from "../../utils/genereate-slug";



interface UpdateProductServiceRequest {
    id:string;
    title: string;
 
    imageUrl: string;
    description: string;
    priceInCents: number;
    stock: number;
    categoryId: string;
}
interface UpdateProductServiceResponse {
    product: Product | null;
    error: Error | null;
}
export class UpdateProductService {
    constructor(private productRepository: ProductRepostory) { }

    async execute({id,title,description,imageUrl,priceInCents,stock,categoryId }: UpdateProductServiceRequest): Promise<UpdateProductServiceResponse> {

        const productExists = await this.productRepository.getById(id);
        if (!productExists) {
            return { product: null, error: new ProductNotFoundError }
        }
        const slug = generateSlug(title);
        const productUpdated = await this.productRepository.update(id,{title,description,slug,imageUrl,priceInCents,stock,categoryId});

        return {
            product: productUpdated,
            error: null
        }
    }
}