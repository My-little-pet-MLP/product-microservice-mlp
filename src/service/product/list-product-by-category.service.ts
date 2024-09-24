import { Product } from "@prisma/client";
import { ProductRepostory } from "../../repository/product-repository";
import { CategoryRepository } from "../../repository/category-repository";
import { CategoryNotFoundError } from "../error/category-not-found-error";

interface ListProductByCategoryServiceRequest {
    categoryId: string;
    page: number;
    size: number;
}
interface ListProductByCategoryServiceResponse {
    products: Product[] | null;
    totalPages: number | null;
    error: Error | null;
}

export class ListProductByCategoryService {
    constructor(private productRepository: ProductRepostory, private categoryRepository: CategoryRepository) {}

    async execute({ categoryId, page, size }: ListProductByCategoryServiceRequest): Promise<ListProductByCategoryServiceResponse> {
        // Verificar se a categoria existe
        const categoryExists = await this.categoryRepository.getById(categoryId);
        if (!categoryExists) {
            return { products: null, totalPages: null, error: new CategoryNotFoundError() };
        }

        // Contar o número total de produtos na categoria
        const totalProducts = await this.productRepository.countProductsByCategoryId(categoryId);
        const totalPages = Math.ceil(totalProducts / size); // Calcular o número de páginas

        // Buscar os produtos paginados
        const products = await this.productRepository.listProductByCategoryId(categoryId, page, size);

        return { products, totalPages, error: null };
    }
}
