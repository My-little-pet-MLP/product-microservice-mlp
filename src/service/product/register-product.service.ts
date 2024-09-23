import { Product } from "@prisma/client";
import { ProductRepostory } from "../../repository/product-repository";
import { StoreRepository } from "../../repository/store-repository";
import { StoreNotFoundError } from "../error/store-not-found-error";
import { CategoryRepository } from "../../repository/category-repository";
import { UnRegisterCategoryError } from "../error/unregister-category-error";
import { ErrorRegisteringProductError } from "../error/error-registering-product-error";
import { generateSlug } from "../../utils/genereate-slug";


interface RegisterProductServiceRequest {
    title: string;
    imageUrl: string;
    description: string;
    priceInCents: number;
    stock: number;
    categoryId: string;
    storeId: string;
}
interface RegisterProductServiceResponse {
    productRegister: Product | null;
    error: Error | null;
}


export class RegisterProductService {
    constructor(private productRepository: ProductRepostory, private storeRepository: StoreRepository, private categoryRepository: CategoryRepository) { }

    async execute({ title, imageUrl, description, priceInCents, stock, categoryId, storeId }: RegisterProductServiceRequest): Promise<RegisterProductServiceResponse> {

        const storeExists = await this.storeRepository.findById(storeId);
        if (!storeExists) {
            console.log(StoreNotFoundError);
            return { productRegister: null, error: new StoreNotFoundError }
        }

        const categoryExists = await this.categoryRepository.getById(categoryId);
        if (!categoryExists) {
            console.log(UnRegisterCategoryError);
            return { productRegister: null, error: new UnRegisterCategoryError }
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
        if (!productRegister) {
            console.log(ErrorRegisteringProductError);
            return { productRegister: null, error: new ErrorRegisteringProductError }
        }
        return { productRegister, error: null };
    }
}