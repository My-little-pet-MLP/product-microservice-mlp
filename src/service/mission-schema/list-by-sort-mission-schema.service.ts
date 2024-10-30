import { MissionSchemaRepository } from "../../repository/mission-schema-repository";
import { MissionSchema } from "@prisma/client";


interface ListAllBySortMissionSchemaServiceRequest {
    quantity: number;
}


interface ListAllBySortMissionSchemaServiceResponse {
    missionsSchemas: MissionSchema[] | null;
    error: Error | null;
}


export class ListAllBySortMissionSchemaService {
    constructor(private missionSchemaRepository: MissionSchemaRepository) { }

    async execute({ quantity }: ListAllBySortMissionSchemaServiceRequest): Promise<ListAllBySortMissionSchemaServiceResponse> {
        const missionsSchemas = await this.missionSchemaRepository.listBySort(quantity);

        return { missionsSchemas, error: null };
    }
}
