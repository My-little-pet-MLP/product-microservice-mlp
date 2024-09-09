import { Prisma, Product } from "@prisma/client";
import { ProductRepostory } from "../product-repository";
import { prisma } from "../../lib/prisma";

export class ProductRepositoryPrisma implements ProductRepostory{
    async register(data: Prisma.ProductUncheckedCreateInput): Promise<Product | null> {
        const product = await prisma.product.create({
            data
        })
        
        return product;
    }

}