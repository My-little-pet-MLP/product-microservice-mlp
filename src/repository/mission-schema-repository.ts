import { MissionSchema, Prisma } from "@prisma/client";

export interface MissionSchemaRepository {
    getById(id: string): Promise<MissionSchema | null>
    register(data: Prisma.MissionSchemaUncheckedCreateInput): Promise<MissionSchema | null>

    listBySort(quantity: number): Promise<MissionSchema[]>
}