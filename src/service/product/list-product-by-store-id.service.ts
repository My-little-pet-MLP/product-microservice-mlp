import { Product } from "@prisma/client";
import { ProductRepostory } from "../../repository/product-repository";
import { StoreRepository } from "../../repository/store-repository";
import { StoreNotFoundError } from "../error/store-not-found-error";


interface ListProductByStoreIdServiceRequest {
    storeId: string;
    page: number;
    size: number;
}
interface ListProductByStoreIdServiceReply {
    products: Product[] | null;
    error: Error | null;
}

export class ListProductByStoreIdService {
    constructor(private productRepository: ProductRepostory, private storeRepository: StoreRepository) { }

    async execute({ storeId, page, size }: ListProductByStoreIdServiceRequest): Promise<ListProductByStoreIdServiceReply> {
        const storeExists = await this.storeRepository.findById(storeId);
        if (!storeExists) {
            return { products: null, error: new StoreNotFoundError }
        }
        const products = await this.productRepository.listProductsByStoreId(storeId, page, size);

        return { products, error: null };
    }
}