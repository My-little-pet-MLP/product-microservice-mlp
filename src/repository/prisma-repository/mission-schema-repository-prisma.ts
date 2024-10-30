import { MissionSchema, Prisma } from "@prisma/client";
import { MissionSchemaRepository } from "../mission-schema-repository";
import { prisma } from "../../lib/prisma";

export class MissionSchemaRepositoryPrisma implements MissionSchemaRepository {
    async getById(id: string): Promise<MissionSchema | null> {
        const missionSchema = await prisma.missionSchema.findFirst({
            where: {
                id
            }
        })
        return missionSchema;
    }
    async register(data: Prisma.MissionSchemaUncheckedCreateInput): Promise<MissionSchema | null> {
        const missionSchema = await prisma.missionSchema.create({
            data
        })
        return missionSchema;
    }
    async listBySort(quantity: number): Promise<MissionSchema[]> {
        // Buscar todas as missões do banco de dados
        const allMissions = await prisma.missionSchema.findMany();

        // Embaralhar as missões aleatoriamente
        const shuffledMissions = allMissions.sort(() => Math.random() - 0.5);

        // Selecionar a quantidade desejada
        const selectedMissions = shuffledMissions.slice(0, quantity);

        return selectedMissions;
    }
}