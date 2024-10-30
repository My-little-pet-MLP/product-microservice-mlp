import { Missao } from "@prisma/client";
import { MissionsRepository } from "../../repository/missions-repository";

interface FindMissionByIdServiceRequest {
    descricao: string;
    customerId: string;

}
interface FindMissionByIdServiceResponse {
    mission: Missao | null;
    error: Error | null;
}
export class FindMissionByIdService {
    constructor(private missionRepository: MissionsRepository) { }
    async execute({ descricao, customerId }: FindMissionByIdServiceRequest): Promise<FindMissionByIdServiceResponse> {
        const mission = await this.missionRepository.register({
            descricao,
            customerId,
            concluido: false
        })
        return { mission, error: null }
    }
}