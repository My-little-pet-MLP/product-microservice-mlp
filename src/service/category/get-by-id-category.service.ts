import { Category } from "@prisma/client";
import { CategoryRepository } from "../../repository/category-repository";
import { CategoryNotFoundError } from "../error/category-not-found-error";


interface GetByIdCategoryServiceRequest{
    id:string;
}
interface GetByIdCategoryServiceReply{
    category:Category|null;
    error: Error|null;
}
export class GetByIdCategoryService{
    constructor(private categoryRepository:CategoryRepository){}

    async execute({id}:GetByIdCategoryServiceRequest):Promise<GetByIdCategoryServiceReply>{
        const category = await this.categoryRepository.getById(id);
        if(!category){
            return {category:null,error:new CategoryNotFoundError}
        }
        return{category:category,error:null}
    }
}