import { Prisma, Missao } from "@prisma/client";
import { MissionsRepository } from "../missions-repository";

// Definindo um tipo para representar a Missão em memória
type InMemoryMission = {
    id: string;
    descricao: string;
    concluido: boolean;
    createdAt: Date;
    updatedAt: Date;
    customerId: string;
    timer: number | null;
    imageUrl: string | null;
};

export class InMemoryMissionsRepository implements MissionsRepository {
    async findById(id: string): Promise<Missao | null> {
        const mission = this.missions.find((mission) => mission.id === id);
        return mission || null;
    }
    private missions: InMemoryMission[] = [];

    // Gerador de ID aleatório
    private generateId(): string {
        return Math.random().toString(36).substring(2, 15);
    }

    // Data atual
    private currentDate(): Date {
        return new Date();
    }

    async register(data: Prisma.MissaoUncheckedCreateInput & { id?: string }): Promise<InMemoryMission> {
        const newMission: InMemoryMission = {
            id: data.id ?? this.generateId(), // Usa o ID fornecido ou gera um novo
            descricao: data.descricao,
            concluido: false,
            createdAt: this.currentDate(),
            updatedAt: this.currentDate(),
            customerId: data.customerId,
            timer: data.timer ?? null,
            imageUrl: data.imageUrl ?? null,
        };

        this.missions.push(newMission);
        return newMission;
    }

    async update(id: string, data: Prisma.MissaoUncheckedUpdateInput): Promise<InMemoryMission | null> {
        const missionIndex = this.missions.findIndex((mission) => mission.id === id);
        if (missionIndex === -1) return null;

        const updatedMission: InMemoryMission = {
            ...this.missions[missionIndex],
            descricao: typeof data.descricao === 'string'
                ? data.descricao
                : this.missions[missionIndex].descricao,
            concluido: typeof data.concluido === 'boolean'
                ? data.concluido
                : this.missions[missionIndex].concluido,
            customerId: typeof data.customerId === 'string'
                ? data.customerId
                : this.missions[missionIndex].customerId,
            timer: typeof data.timer === 'number' || data.timer === null
                ? data.timer
                : this.missions[missionIndex].timer,
            imageUrl: typeof data.imageUrl === 'string' || data.imageUrl === null
                ? data.imageUrl
                : this.missions[missionIndex].imageUrl,
            updatedAt: this.currentDate(),
        };

        this.missions[missionIndex] = updatedMission;
        return updatedMission;
    }

    async updateComplete(id: string): Promise<InMemoryMission | null> {
        const missionIndex = this.missions.findIndex((mission) => mission.id === id);
        if (missionIndex === -1) return null;

        this.missions[missionIndex].concluido = true;
        this.missions[missionIndex].updatedAt = this.currentDate();

        return this.missions[missionIndex];
    }

    async listAllByCustomerIdUncomplete(customerId: string): Promise<InMemoryMission[]> {
        return this.missions.filter(
            (mission) => mission.customerId === customerId && !mission.concluido
        );
    }

    async listAllByCustomerId(customerId: string): Promise<InMemoryMission[]> {
        return this.missions.filter((mission) => mission.customerId === customerId);
    }

    async delete(id: string): Promise<boolean> {
        const missionIndex = this.missions.findIndex((mission) => mission.id === id);
        if (missionIndex === -1) return false;

        this.missions.splice(missionIndex, 1);
        return true;
    }

    async countMissionsByCustomerId(customerId: string): Promise<number> {
        return this.missions.filter((mission) => mission.customerId === customerId).length;
    }
}
