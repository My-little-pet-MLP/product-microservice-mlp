import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { RegisterCupomService } from "../../../service/cupom/register-cupom.service";
import { StoreRepositoryPrisma } from "../../../repository/prisma-repository/store-repository-prisma";
import { CupomRepositoryPrisma } from "../../../repository/prisma-repository/cupom-repository-prisma";
import { InvalidDateFormatForValidateAtError } from "../../../service/error/invalid-date-format-for-validate-at-error";
import { QuantityIsNegativeError } from "../../../service/error/quantity-is-negative-error";
import { StoreNotFoundError } from "../../../service/error/store-not-found-error";

export async function RegisterCupomController(req: FastifyRequest, res: FastifyReply) {
    const registerCupomBodySchema = z.object({
        store_id: z.string().min(1, "store_id is required"),
        description: z.string().min(1, "description is required").max(144, "the description has a maximum of 144 characters"),
        percentage: z.number().int().min(1, "the percentage must be from 1 to 100").max(100, "the percentage must be from 1 to 100"),
        validateAt: z.string().datetime("format invalid, correct: 2024-12-31T23:59:59Z"),
        quantity: z.number().int().min(1, "quantity > 1")
    })

    const { description, percentage, quantity, store_id, validateAt } = registerCupomBodySchema.parse(req.body)
    const storeRepository = new StoreRepositoryPrisma();
    const cupomRepository = new CupomRepositoryPrisma();
    const registerCupomService = new RegisterCupomService(storeRepository, cupomRepository);
    const { cupomInfo, error, quantityCreated } = await registerCupomService.execute({
        storeId: store_id,
        description,
        porcentagem: percentage,
        quantity,
        validateAt,
    })
    if (error) {
        if (error instanceof InvalidDateFormatForValidateAtError || error instanceof QuantityIsNegativeError) {
            return res.status(400).send({ message: error.message })
        }
        if (error instanceof StoreNotFoundError) {
            return res.status(404).send({ message: error.message })
        }
        console.log("Internal Server Error in RegisterCupomController: " + error.message)
        return res.status(500).send({ message: "Internal Server Error" })
    }
    return res.status(200).send({ cupomInfo, quantityCreated })
}