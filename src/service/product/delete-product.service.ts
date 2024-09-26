import { Product } from "@prisma/client";
import { ProductRepostory } from "../../repository/product-repository";
import { ProductNotFoundError } from "../error/product-not-found-error";

interface DeleteProductServiceReq {
    id: string;
}
interface DeleteProductServiceRes {
    product: Product | null;
    error: Error | null;
}

export class DeleteProductService {
    constructor(private productRepository: ProductRepostory) { }

    async execute({ id }: DeleteProductServiceReq): Promise<DeleteProductServiceRes> {
        const ProductExists = await this.productRepository.getById(id);
        if (!ProductExists) {
            return { product: null, error: new ProductNotFoundError }
        }
        await this.productRepository.delete(id);
        return { product: null, error: null };
    }
}