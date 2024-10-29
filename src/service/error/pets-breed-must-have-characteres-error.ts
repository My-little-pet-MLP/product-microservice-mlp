export class PetsBreedMustHaveCharacteresError extends Error{
    constructor(){
        super("the pet's breed must have 1 to 80 characters")
    }
}