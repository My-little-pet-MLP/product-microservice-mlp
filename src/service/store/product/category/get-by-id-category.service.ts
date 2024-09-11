import { Category } from "@prisma/client";
import { CategoryRepository } from "../../../../repository/category-repository";
import { CategoryNotFoundError } from "../../../error/category-not-found-error";

interface GetByIdCategoryServiceRequest{
    id:string;
}
interface GetByIdCategoryServiceReply{
    category:Category
}
export class GetByIdCategoryService{
    constructor(private categoryRepository:CategoryRepository){}

    async execute({id}:GetByIdCategoryServiceRequest):Promise<GetByIdCategoryServiceReply>{
        const category = await this.categoryRepository.getById(id);
        if(!category){
            throw new CategoryNotFoundError;
        }
        return {
            category
        }
    }
}