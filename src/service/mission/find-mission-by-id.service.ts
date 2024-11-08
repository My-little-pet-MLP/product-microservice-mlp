import { Missao } from "@prisma/client";
import { MissionsRepository } from "../../repository/missions-repository";
import { MissionNotFoundError } from "../error/mission-not-found-error";

interface FindMissionByIdServiceRequest {
    id: string;

}
interface FindMissionByIdServiceResponse {
    mission: Missao | null;
    error: Error | null;
}
export class FindMissionByIdService {
    constructor(private missionRepository: MissionsRepository) { }
    async execute({ id }: FindMissionByIdServiceRequest): Promise<FindMissionByIdServiceResponse> {
        const mission = await this.missionRepository.findById(id)
        if (!mission) {
            return { mission: null, error: new MissionNotFoundError }
        }
        return { mission, error: null }
    }
}