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
    products: Product[]|null;
    error:Error|null;
}
export class ListProductByCategoryService {
    constructor(private productRepository: ProductRepostory, private categoryRepository: CategoryRepository) { }

    async execute({ categoryId, page, size }: ListProductByCategoryServiceRequest): Promise<ListProductByCategoryServiceResponse> {
        const categoryExists = await this.categoryRepository.getById(categoryId);
        if (!categoryExists) {
            return {products:null,error:new CategoryNotFoundError}
        }

        const products = await this.productRepository.listProductByCategoryId(categoryId, page, size);

        return { products,error:null };
    }
}