export class OrderDoesNotHaveProductInOrderRegisted extends Error{
    constructor(){
        super("Order does not have productInOrder registered")
    }
}