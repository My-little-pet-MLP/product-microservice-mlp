export class CategoryNotFoundError extends Error {
    constructor(){
        super("Categoria não existe!")
    }
}