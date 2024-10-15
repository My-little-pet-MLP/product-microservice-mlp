import { Category, Product, Store } from "@prisma/client";
import { ProductRepostory } from "../../repository/product-repository";
import { ProductNotFoundError } from "../error/product-not-found-error";
import { StoreRepository } from "../../repository/store-repository";
import { CategoryRepository } from "../../repository/category-repository";
import { CategoryNotFoundError } from "../error/category-not-found-error";
import { StoreNotFoundError } from "../error/store-not-found-error";

interface GetProductByIdServiceRequest {
    id: string;
}

interface GetProductByIdServiceReply {
    product: {
        id: string;
        title: string;
        slug: string;
        imageUrl: string;
        description: string;
        priceInCents: number;
        stock: number;
        category: Category;
        store: Store;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null;
    error: Error | null;
}

export class GetProductByIdService {
    constructor(
        private productRepository: ProductRepostory,
        private storeRepository: StoreRepository,
        private categoryRepository: CategoryRepository
    ) {}

    async execute({ id }: GetProductByIdServiceRequest): Promise<GetProductByIdServiceReply> {
        const product = await this.productRepository.getById(id);
        if (!product) {
            return { product: null, error: new ProductNotFoundError() };
        }

        const category = await this.categoryRepository.getById(product.categoryId);
        if (!category) {
            return { product: null, error: new CategoryNotFoundError() };
        }

        const store = await this.storeRepository.findById(product.storeId);
        if (!store) {
            return { product: null, error: new StoreNotFoundError() };
        }

        // Cria o objeto de retorno com os dados completos de categoria e loja
        const productWithRelations = {
            id: product.id,
            title: product.title,
            slug: product.slug,
            imageUrl: product.imageUrl,
            description: product.description,
            priceInCents: product.priceInCents,
            stock: product.stock,
            category,
            store,
            isActive: product.isActive,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
        };

        return { product: productWithRelations, error: null };
    }
}
