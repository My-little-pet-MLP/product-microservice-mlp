export class NameIsMustLongError extends Error{
    constructor(){
        super("name can't have must 80 characteres");
    }
}