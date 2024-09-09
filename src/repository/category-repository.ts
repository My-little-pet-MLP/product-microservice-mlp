import { Category } from "@prisma/client";

export interface CategoryRepository {
    listAll():Promise<Category[]>
}