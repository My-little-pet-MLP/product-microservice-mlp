import { Prisma, Product } from "@prisma/client";
import { ProductRepostory } from "../product-repository";
import { prisma } from "../../lib/prisma";

export class ProductRepositoryPrisma implements ProductRepostory {
    async countProductsByStoreId(storeId: string): Promise<number> {
        return await prisma.product.count({
            where: {
                storeId: storeId
            }
        });
    }
    async update(id: string, data: {
        id: string;
        title: string;
        slug: string;
        imageUrl: string;
        description: string;
        priceInCents: number;
        stock: number;
        categoryId: string;
    }): Promise<Product> {
        const product = await prisma.product.update({
            where: {
                id,
            },
            data,
        })
        return product
    }
    async countProductsByCategoryId(categoryId: string): Promise<number> {
        return await prisma.product.count({
            where: {
                categoryId: categoryId,
            },
        });
    }
    async listProductByCategoryId(categoryId: string, page: number, size: number): Promise<Product[]> {
        const skip = (page - 1) * size;

        const products = await prisma.product.findMany({
            where: {
                categoryId,
            },
            skip,
            take: size
        })
        return products;
    }
    async getById(id: string): Promise<Product | null> {
        const product = await prisma.product.findFirst({
            where: {
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