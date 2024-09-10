import { Category, Prisma } from "@prisma/client";

export interface CategoryRepository {
    register(data:Prisma.CategoryUncheckedCreateInput):Promise<Category>
    listAll():Promise<Category[]>
   
}