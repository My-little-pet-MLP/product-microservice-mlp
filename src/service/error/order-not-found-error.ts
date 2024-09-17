export class OrderNotFoundError extends Error{
    constructor(){
        super("order não encontrada!")
    }
}