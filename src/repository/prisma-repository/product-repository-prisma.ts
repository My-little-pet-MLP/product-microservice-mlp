import { Prisma, Product } from "@prisma/client";
import { ProductRepostory } from "../product-repository";
import { prisma } from "../../lib/prisma";

export class ProductRepositoryPrisma implements ProductRepostory {
    async getById(id: string): Promise<Product | null> {
       const product =  await prisma.product.findFirst({
        where:{
            id,
        }
       })
       return product;
    }
    async listProductsByStoreId(storeId: string, page: number, size: number): Promise<Product[]> {
        const skip = (page - 1) * size; // Calcula quantos itens devem ser ignorados

        const products = await prisma.product.findMany({
            where: {
                storeId: storeId, // Filtra os produtos pelo storeId
            },
            skip: skip, // Ignora os primeiros `skip` registros
            take: size, // Retorna apenas `size` registros
        });

        return products;
    }
    async register(data: Prisma.ProductUncheckedCreateInput): Promise<Product | null> {
        const product = await prisma.product.create({
            data
        })

        return product;
    }

}