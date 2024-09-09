import { Category } from "@prisma/client";
import { CategoryRepository } from "../category-repository";
import { prisma } from "../../lib/prisma";

export class CategoryRepositoryPrisma implements CategoryRepository {
    async listAll(): Promise<Category[]> {
        const categories = await prisma.category.findMany({

        })
        return categories;
    }
    
}