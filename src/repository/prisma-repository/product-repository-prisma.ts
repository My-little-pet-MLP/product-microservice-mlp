import { Prisma, Product } from "@prisma/client";
import { ProductRepostory } from "../product-repository";
import { prisma } from "../../lib/prisma";

export class ProductRepositoryPrisma implements ProductRepostory {
    async delete(id: string): Promise<void> {
        await prisma.product.update({
            where: {
                id
            },
            data: {
                isActive: false,
            }
        });
    }
    async countProductsByStoreId(storeId: string): Promise<number> {
        return await prisma.product.count({
            where: {
                storeId: storeId,
                isActive: true
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
                isActive:true
            },
        });
    }
    async listProductByCategoryId(categoryId: string, page: number, size: number): Promise<Product[]> {
        const skip = (page - 1) * size;

        const products = await prisma.product.findMany({
            where: {
                categoryId,
                isActive:true
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
                isActive:true
            },
            skip: skip, // Ignora os primeiros `skip` registros
            take: size, // Retorna apenas `size` registros
            orderBy: {
                isActive: 'desc', // Ordena pelos produtos com isActive: false no final
            },
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