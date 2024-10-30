import { MissionSchema } from "@prisma/client";
import { MissionSchemaRepository } from "../../repository/mission-schema-repository";
import { MissionSchemaNotFoundError } from "../error/mission-schema-not-found-error";

interface GetByIdMissionSchemaServiceRequest {
    id: string;
}
interface GetByIdMissionSchemaServiceResponse {
    missionSchema: MissionSchema | null;
    error: Error | null;
}
export class GetByIdMissionSchemaService {
    constructor(private missionSchemaRepository: MissionSchemaRepository) { }
    async execute({ id }: GetByIdMissionSchemaServiceRequest): Promise<GetByIdMissionSchemaServiceResponse> {
        const missionSchema = await this.missionSchemaRepository.getById(id);

        if (!missionSchema) {
            return { missionSchema: null, error: new MissionSchemaNotFoundError }
        }
        return { missionSchema, error: null }
    }
}