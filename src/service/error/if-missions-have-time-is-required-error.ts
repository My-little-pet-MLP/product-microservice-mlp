export class IfMissionsHaveTimeIsRequiredError extends Error{
    constructor(){
        super("If the mission has time, the timer is mandatory")
    }
}