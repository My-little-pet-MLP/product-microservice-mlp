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
    totalPages: number | null;
    error: Error | null;
}

export class ListProductByStoreIdService {
    constructor(private productRepository: ProductRepostory, private storeRepository: StoreRepository) { }

    async execute({ storeId, page, size }: ListProductByStoreIdServiceRequest): Promise<ListProductByStoreIdServiceReply> {
        // Verificar se a loja existe
        const storeExists = await this.storeRepository.findById(storeId);
        if (!storeExists) {
            return { products: null, totalPages: null, error: new StoreNotFoundError() };
        }

        // Contar o número total de produtos
        const totalProducts = await this.productRepository.countProductsByStoreId(storeId);
        const totalPages = Math.ceil(totalProducts / size); // Calcular o número de páginas

        // Buscar os produtos paginados
        const products = await this.productRepository.listProductsByStoreId(storeId, page, size);

        return { products, totalPages, error: null };
    }
}
