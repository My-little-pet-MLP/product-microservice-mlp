import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { MissionsRepositoryPrisma } from "../../../repository/prisma-repository/missions-repository-prisma";
import { CompleteMissionByIdService } from "../../../service/mission/complete-mission-by-id.service";
import { MissionNotFoundError } from "../../../service/error/mission-not-found-error";

export async function CompleteMissionByIdController(req: FastifyRequest, res: FastifyReply) {
    const completeMissionByIdParamsSchema = z.object({
        id: z.string().min(1, "id is required")
    })

    const { id } = completeMissionByIdParamsSchema.parse(req.params)
    const missionRepository = new MissionsRepositoryPrisma();
    const completeMissionByIdService = new CompleteMissionByIdService(missionRepository)

    const { mission, error } = await completeMissionByIdService.execute({ id })

    if (error) {
        if (error instanceof MissionNotFoundError) {
            return res.status(404).send({ message: error.message })
        }
        console.log("Internal Server Error in CompleteMissionByIdController: " + error.message)
        return res.status(500).send({ message: "Internal Server Error" })
    }
    return res.status(200).send(mission)
}