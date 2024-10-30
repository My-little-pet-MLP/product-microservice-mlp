import { MissionSchema } from "@prisma/client";
import { MissionSchemaRepository } from "../../repository/mission-schema-repository";
import { IfMissionsHaveTimeIsRequiredError } from "../error/if-missions-have-time-is-required-error";

interface RegisterMissionSchemaServiceRequest {
    description: string;
    isMissionByImage: boolean;
    isMissionByTimer: boolean;
    timer: number | null | undefined;
}
interface RegisterMissionSchemaServiceResponse {
    missionSchema: MissionSchema | null;
    error: Error | null;
}

export class RegisterMissionSchemaService {
    constructor(private missionSchemaRepository: MissionSchemaRepository) { }

    async execute({ description, isMissionByImage, isMissionByTimer, timer }: RegisterMissionSchemaServiceRequest): Promise<RegisterMissionSchemaServiceResponse> {
        if (isMissionByTimer == true && !timer) {
            return { missionSchema: null, error: new IfMissionsHaveTimeIsRequiredError }
        }
        const missionSchema = await this.missionSchemaRepository.register({
            descricao: description,
            isMissionByImage,
            isMissionByTimer,
            timer
        });

        return { missionSchema, error: null }
    }
}