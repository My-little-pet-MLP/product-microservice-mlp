import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { GrantCouponToCustomerByIdService } from "../../../service/cupom/grant-coupon-to-customer-by-id.service";
import { CupomRepositoryPrisma } from "../../../repository/prisma-repository/cupom-repository-prisma";
import { CustomerNotFoundError } from "../../../service/error/customer-not-found-error";
import { CupomNotFoundError } from "../../../service/error/cupom-not-found-error";
import { ErrorFetchingCustomerError } from "../../../service/error/error-fetchig-customer-error";

export async function GrantCouponToCustomerByIdController(req: FastifyRequest, res: FastifyReply) {
    const grantCouponToCustomerByIdParamsSchema = z.object({
        customer_id: z.string().min(1, "customer_id is required")
    })
    const { customer_id } = grantCouponToCustomerByIdParamsSchema.parse(req.params);


    const cupomRepository = new CupomRepositoryPrisma();
    const grantCouponToCustomerByIdService = new GrantCouponToCustomerByIdService(cupomRepository);

    const { cupom, error } = await grantCouponToCustomerByIdService.execute({ customerId: customer_id });
    if (error) {
        if (error instanceof CustomerNotFoundError || error instanceof CupomNotFoundError) {
            return res.status(404).send({ message: error.message })
        }
        if (error instanceof ErrorFetchingCustomerError) {
            return res.status(400).send({ message: error.message })
        }
        console.log("Internal Server Error in GrantCouponToCustomerByIdController: " + error.message)
        return res.status(500).send({ message: "Internal Server Error" })
    }
    return res.status(200).send(cupom)
}