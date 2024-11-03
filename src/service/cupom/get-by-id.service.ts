import { Cupom } from "@prisma/client";
import { CupomRepository } from "../../repository/cupom-repository";
import { CupomNotFoundError } from "../error/cupom-not-found-error";

interface GetCupomByIdServiceRequest {
    id: string;
}
interface GetCupomByIdServiceResponse {
    cupom: Cupom | null;
    error: Error | null;
}
export class GetCupomByIdService {
    constructor(private cupomRepository: CupomRepository) { }

    async execute({ id }: GetCupomByIdServiceRequest): Promise<GetCupomByIdServiceResponse> {
        const cupom = await this.cupomRepository.getById(id);
        if (!cupom) {
            return { cupom: null, error: new CupomNotFoundError }
        }
        return { cupom, error: null }
    }
}