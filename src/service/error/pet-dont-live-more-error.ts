export class PetDontLiveMoreItError extends Error{
    constructor(){
        super("Pets like dogs and cats don't live more than 30 years");
    }
}