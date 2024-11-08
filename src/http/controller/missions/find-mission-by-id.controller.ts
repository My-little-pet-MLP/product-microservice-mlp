import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { MissionsRepositoryPrisma } from "../../../repository/prisma-repository/missions-repository-prisma";
import { FindMissionByIdService } from "../../../service/mission/find-mission-by-id.service";
import { MissionNotFoundError } from "../../../service/error/mission-not-found-error";

export async function FindMissionByidController(req: FastifyRequest, res: FastifyReply) {
    const findMissionByIdParamsSchema = z.object({
        id: z.string().min(1, "mission is required")
    })
    const { id } = findMissionByIdParamsSchema.parse(req.params)

    const missionRepository = new MissionsRepositoryPrisma();
    const findMissionByIdService = new FindMissionByIdService(missionRepository);

    const { mission, error } = await findMissionByIdService.execute({ id });
    if (error) {
        if (error instanceof MissionNotFoundError) {
            return res.status(404).send({ message: error.message })
        }
        console.log("Internal Server Error in FindMissionByidController: " + error.message)
        return res.status(500).send({ message: "Internal Server Error" })
    }
    return res.status(200).send(mission)
}