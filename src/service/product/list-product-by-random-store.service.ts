import { Product, Store } from "@prisma/client";
import { ProductRepostory } from "../../repository/product-repository";
import { StoreRepository } from "../../repository/store-repository";
import { StoreNotFoundError } from "../error/store-not-found-error";

interface ListAllProductByStoreRandomServiceRequest {
    page: number;
    size: number;
}

interface ListAllProductByStoreRandomServiceResponse {
    store: Store;
    products: Product[];
    totalPages: number;
    error: Error | null;
}

export class ListAllProductByStoreRandomService {
    constructor(
        private productRepository: ProductRepostory, 
        private storeRepository: StoreRepository
    ) {}

    async execute({ page, size }: ListAllProductByStoreRandomServiceRequest): Promise<ListAllProductByStoreRandomServiceResponse> {
        // Validação básica de página e tamanho
        if (page < 1 || size < 1) {
            throw new Error("Page and size must be positive numbers.");
        }

        // Busca de uma loja aleatória
        const randomStore = await this.storeRepository.getRandomStore();
        if (!randomStore) {
            throw new StoreNotFoundError(); // Lança erro se não houver loja
        }

        // Conta o total de produtos na loja
        const totalProducts = await this.productRepository.countProductsByStoreId(randomStore.id);
        const totalPages = Math.ceil(totalProducts / size); // Calcula o número de páginas

        // Busca os produtos paginados
        const products = await this.productRepository.listProductsByStoreId(randomStore.id, page, size);

        // Retorna os dados do serviço
        return {
            store: randomStore,
            products: products.length > 0 ? products : [], // Garante que seja um array vazio se não houver produtos
            totalPages,
            error: null
        };
    }
}
