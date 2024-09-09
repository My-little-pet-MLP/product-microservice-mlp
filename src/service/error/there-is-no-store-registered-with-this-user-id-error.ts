export class ThereIsNoStoreRegisteredWithThisUserIdError extends Error {
    constructor(){
        super("There is no store registered with this userId!")
    }
}