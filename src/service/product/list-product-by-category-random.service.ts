import { Category, Product } from "@prisma/client";
import { ProductRepostory } from "../../repository/product-repository";
import { CategoryRepository } from "../../repository/category-repository";
import { CategoryNotFoundError } from "../error/category-not-found-error";

interface ListAllProductByCategoryRandomServiceRequest {
    page: number;
    size: number;
}
interface ListAllProductByCategoryRandomServiceResponse {
    category: Category;
    products: Product[];
    totalPages: number;
    error: Error | null;
}

export class ListAllProductByCategoryRandomService {
    constructor(
        private productRepository: ProductRepostory, 
        private categoryRepository: CategoryRepository
    ) {}

    async execute({ page, size }: ListAllProductByCategoryRandomServiceRequest): Promise<ListAllProductByCategoryRandomServiceResponse> {
        // Validação básica de página e tamanho
        if (page < 1 || size < 1) {
            throw new Error("Page and size must be positive numbers.");
        }

        // Busca de categoria aleatória
        const categoryRandom = await this.categoryRepository.SortRandomCategory();
        if (!categoryRandom) {
            throw new CategoryNotFoundError(); // Lança erro se não houver categoria
        }

        // Conta o total de produtos na categoria
        const totalProducts = await this.productRepository.countProductsByCategoryId(categoryRandom.id);
        const totalPages = Math.ceil(totalProducts / size); // Calcula o número de páginas

        // Busca os produtos paginados
        const products = await this.productRepository.listProductByCategoryId(categoryRandom.id, page, size);

        // Retorna os dados do serviço
        return {
            category: categoryRandom,
            products: products.length > 0 ? products : [], // Garante que seja um array vazio se não houver produtos
            totalPages,
            error: null
        };
    }
}
