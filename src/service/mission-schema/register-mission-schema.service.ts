import { MissionSchemaRepository } from "../../repository/mission-schema-repository";

interface RegisterMissionSchemaServiceRequest {

}
interface RegisterMissionSchemaServiceResponse {

}

export class RegisterMissionSchemaService {
    constructor(private missionSchemaRepository: MissionSchemaRepository) {}
}