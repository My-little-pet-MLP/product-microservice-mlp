export class OrderIsNotPedingError extends Error{
    constructor(){
        super("The order is not pending, it is only possible to add products to pending orders!")
    }
}