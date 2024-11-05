import { Missao } from "@prisma/client";
import { MissionsRepository } from "../../repository/missions-repository";
import { MissionNotFoundError } from "../error/mission-not-found-error";

interface CompleteMissionByIdServiceRequest {
    id: string;
}
interface CompleteMissionByIdServiceResponse {
    mission: Missao | null;
    error: Error | null;
}
export class CompleteMissionByIdService {
    constructor(private missionRepository: MissionsRepository) { }
    async execute({ id }: CompleteMissionByIdServiceRequest): Promise<CompleteMissionByIdServiceResponse> {
        const mission = await this.missionRepository.updateComplete(id);
        if (!mission) {
            return { mission: null, error: new MissionNotFoundError }
        }
        return { mission, error: null }
    }
}