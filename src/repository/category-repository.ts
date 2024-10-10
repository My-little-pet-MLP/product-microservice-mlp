import { Category, Prisma } from "@prisma/client";

export interface CategoryRepository {
    getById(id:string):Promise<Category|null>
    register(data:Prisma.CategoryUncheckedCreateInput):Promise<Category>
    listAll():Promise<Category[]>
    SortRandomCategory():Promise<Category|null>
}