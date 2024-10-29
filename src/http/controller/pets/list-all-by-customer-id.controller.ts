import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { PetRepositoryPrisma } from "../../../repository/prisma-repository/pet-repository-prisma";
import { ListAllByCustomerIdService } from "../../../service/pet/list-all-by-customer-id.service";
import { CustomerNotFoundError } from "../../../service/error/customer-not-found-error";
import { ErrorFetchingCustomerError } from "../../../service/error/error-fetchig-customer-error";

export async function ListAllByCustomerIdController(req: FastifyRequest, res: FastifyReply) {
    const listAllByCustomerIdControllerParamsSchema = z.object({
        customer_id: z.string().min(1, "customer_id is required")
    })

    const { customer_id } = listAllByCustomerIdControllerParamsSchema.parse(req.params);


    const petRepository = new PetRepositoryPrisma();

    const listAllByCustomerIdService = new ListAllByCustomerIdService(petRepository);

    const { pets, error } = await listAllByCustomerIdService.execute({ customerId: customer_id })

    if (error) {
        if (error instanceof CustomerNotFoundError) {
            return res.status(404).send({ message: error.message })
        }
        if (error instanceof ErrorFetchingCustomerError) {
            return res.status(400).send({ message: error.message })
        }
        return res.status(500).send({ message: "Internal Server Error in ListAllByCustomerIdController: " + error.message })
    }
    return res.status(200).send(pets)
}