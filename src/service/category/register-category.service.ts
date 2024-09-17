import { Category } from "@prisma/client";
import { CategoryRepository } from "../../repository/category-repository";


interface RegisterCategoryServiceRequest{
    title:string;
}
interface RegisterCategoryServiceReply{
    category:Category
}
function generateSlug(title: string): string {
    return title
        .toLowerCase() // converte para minúsculas
        .normalize("NFD") // decompõe caracteres acentuados
        .replace(/[\u0300-\u036f]/g, "") // remove acentos
        .replace(/\s+/g, '-') // substitui espaços por hífens
        .replace(/[^\w-]+/g, '') // remove caracteres especiais
        .replace(/--+/g, '-') // substitui múltiplos hífens por um único hífen
        .replace(/^-+/, '') // remove hífen do início
        .replace(/-+$/, ''); // remove hífen do final
}
export class RegisterCategoryService{
    constructor(private categoryRepository:CategoryRepository){}

    async execute({title}:RegisterCategoryServiceRequest):Promise<RegisterCategoryServiceReply>{
        const slug = generateSlug(title);
        const category = await this.categoryRepository.register({
            title,
            slug
        })
    return {category};
    }
}