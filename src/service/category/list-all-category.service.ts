import { Category } from "@prisma/client";
import { CategoryRepository } from "../../repository/category-repository";


interface ListAllCategoryServiceRequest{

}
interface ListAllCategoryServiceResponse{
    categories:Category[];
}
export class ListAllCategoryService {
    constructor(private categoryRepository:CategoryRepository){}

    async execute({}:ListAllCategoryServiceRequest):Promise<ListAllCategoryServiceResponse>{
        const categories = await this.categoryRepository.listAll();
        return {categories};
    }
}