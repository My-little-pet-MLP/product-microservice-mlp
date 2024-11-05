import { Cupom } from "@prisma/client";
import { CupomRepository } from "../../repository/cupom-repository";
import { StoreRepository } from "../../repository/store-repository";
import { StoreNotFoundError } from "../error/store-not-found-error";
import { InvalidDateFormatForValidateAtError } from "../error/invalid-date-format-for-validate-at-error";
import { QuantityIsNegativeError } from "../error/quantity-is-negative-error";

interface RegisterCupomServiceRequest {
    storeId: string;
    description: string;
    porcentagem: number;
    validateAt: string;
    quantity: number;
}

interface RegisterCupomServiceResponse {
    cupomInfo: Omit<Cupom, "id" | "createdAt" | "customerId"> | null;
    quantityCreated: number;
    error: Error | null;
}

export class RegisterCupomService {
    constructor(
        private storeRepository: StoreRepository,
        private cupomRepository: CupomRepository
    ) { }

    async execute({ storeId, porcentagem, description, validateAt, quantity }: RegisterCupomServiceRequest): Promise<RegisterCupomServiceResponse> {
        if (isNaN(Date.parse(validateAt))) {
            return { cupomInfo: null, quantityCreated: 0, error: new InvalidDateFormatForValidateAtError };
        }
        if (quantity <= 0) {
            return { cupomInfo: null, quantityCreated: 0, error: new QuantityIsNegativeError };
        }
        const storeExists = await this.storeRepository.findById(storeId);
        if (!storeExists) {
            return { cupomInfo: null, quantityCreated: 0, error: new StoreNotFoundError() };
        }

        for (let i = 0; i < quantity; i++) {
            await this.cupomRepository.register({
                storeId,
                description,
                porcentagem,
                isValid: true,
                ValidateAt: new Date(validateAt),
                createdAt: new Date()
            });
        }

        const cupomInfo = {
            storeId,
            description,
            porcentagem,
            isValid: true,
            ValidateAt: new Date(validateAt)
        };

        return { cupomInfo, quantityCreated: quantity, error: null };
    }
}
