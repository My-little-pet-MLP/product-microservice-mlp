import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { GenerateMissionsInDatService } from "../../../service/mission/generate-missions-in-day.service";
import { MissionsRepositoryPrisma } from "../../../repository/prisma-repository/missions-repository-prisma";
import { MissionSchemaRepositoryPrisma } from "../../../repository/prisma-repository/mission-schema-repository-prisma";
import { CustomerNotFoundError } from "../../../service/error/customer-not-found-error";
import { ErrorFetchingCustomerError } from "../../../service/error/error-fetchig-customer-error";

export async function GenerateMissionsInDateController(req: FastifyRequest, res: FastifyReply) {
    const generateMissionsInDateParamsSchema = z.object({
        customer_id: z.string().min(1, "customer_id is required")
    })
    const { customer_id } = generateMissionsInDateParamsSchema.parse(req.params)

    const missionRepository = new MissionsRepositoryPrisma();
    const missionSchemaRepository = new MissionSchemaRepositoryPrisma();
    const generateMissionsInDateService = new GenerateMissionsInDatService(missionRepository, missionSchemaRepository)

    const { missions, error } = await generateMissionsInDateService.execute({ customerId: customer_id });

    if (error) {
        if (error instanceof CustomerNotFoundError) {
            return res.status(404).send({ message: error.message })
        }
        if (error instanceof ErrorFetchingCustomerError) {
            return res.status(400).send({ message: error.message })
        }
        console.log("Internal Server Error in GenerateMissionsInDateController: " + error.message)
        return res.status(500).send({ message: "Internal Server Error" })
    }
    return res.status(200).send(missions)
}