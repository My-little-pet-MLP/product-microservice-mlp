import { Missao, Prisma } from "@prisma/client";
import { MissionsRepository } from "../../repository/missions-repository";
import { MissionSchemaRepository } from "../../repository/mission-schema-repository";
import { CustomerNotFoundError } from "../error/customer-not-found-error";
import { ErrorFetchingCustomerError } from "../error/error-fetchig-customer-error";
import { clearkClientCustomer } from "../../lib/cleark";

interface GenerateMissionsInDatServiceRequest {
    customerId: string;
}
interface GenerateMissionsInDatServiceResponse {
    missions: Missao[] | null;
    error: Error | null;
}

export class GenerateMissionsInDatService {
    constructor(
        private missionRepository: MissionsRepository,
        private missionSchemaRepository: MissionSchemaRepository
    ) { }

    async execute({
        customerId,
    }: GenerateMissionsInDatServiceRequest): Promise<GenerateMissionsInDatServiceResponse> {

        try {
            const customerExists = await clearkClientCustomer.users.getUser(customerId);
            if (!customerExists) {
                return { missions: null, error: new CustomerNotFoundError() };
            }
        } catch (error) {
            return { missions: null, error: new ErrorFetchingCustomerError() };
        }
        const customerHaveMissionByDay =
            await this.missionRepository.checkinCustomerIdHaveMissionInDate(customerId);

        if (!customerHaveMissionByDay) {
            const missionSelects = await this.missionSchemaRepository.listBySort(5);

            const generatedMissions = (
                await Promise.all(
                    missionSelects.map(async (schema) => {
                        return await this.missionRepository.register({
                            descricao: schema.descricao,
                            customerId,
                            concluido: false,
                            timer: schema.timer ?? null,
                            imageUrl: schema.imageUrl ?? null,
                        });
                    })
                )
            ).filter((mission): mission is Missao => mission !== null); // Filtra valores nulos

            return { missions: generatedMissions, error: null };
        }

        const missions = await this.missionRepository.listAllByCustomerId(customerId);
        return { missions, error: null };
    }
}
