export class QuantityIsNegativeError extends Error{
    constructor(){
        super("Quantity is negative!")
    }
}