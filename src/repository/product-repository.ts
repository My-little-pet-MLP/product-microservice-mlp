import { Prisma, Product } from "@prisma/client"
export interface ProductRepostory {
    register(data:Prisma.ProductUncheckedCreateInput):Promise<Product|null>
}