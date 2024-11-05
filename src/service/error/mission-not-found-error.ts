export class MissionNotFoundError extends Error{
    constructor(){
        super("Mission not found")
    }
}