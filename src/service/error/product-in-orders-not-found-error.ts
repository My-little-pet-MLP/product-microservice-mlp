export class ProductInOrdersNotFoundError extends Error{
    constructor(){
        super("ProductInOrders Not Found!")
    }
}