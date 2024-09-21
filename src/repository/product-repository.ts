import { Prisma, Product } from "@prisma/client"
export interface ProductRepostory {
    register(data: Prisma.ProductUncheckedCreateInput): Promise<Product | null>
    listProductsByStoreId(storeId: string, page: number, size: number): Promise<Product[]>
    getById(id: string): Promise<Product | null>
    listProductByCategoryId(categoryId: string, page: number, size: number): Promise<Product[]>
    update(id: string, data:{
        title: string;
        slug: string;
        imageUrl: string;
        description: string;
        priceInCents: number;
        stock: number;
        categoryId: string;}): Promise<Product>
}