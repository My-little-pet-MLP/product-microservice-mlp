import { Category, Prisma } from "@prisma/client";
import { CategoryRepository } from "../category-repository";
import { prisma } from "../../lib/prisma";

export class CategoryRepositoryPrisma implements CategoryRepository {
    async register(data: Prisma.CategoryUncheckedCreateInput): Promise<Category> {
        const category = await prisma.category.create({
            data:{
                title: data.title,
                slug: data.slug
            }
            
        })
        return category;
    }
    async listAll(): Promise<Category[]> {
        const categories = await prisma.category.findMany({

        })
        return categories;
    }
    
}