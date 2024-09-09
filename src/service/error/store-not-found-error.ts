export class StoreNotFoundError extends Error {
    constructor(){
        super("store not found!")
    }
}