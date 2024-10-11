import { Store } from "@prisma/client";
import { StoreRepository } from "../../repository/store-repository";
import { StoreNotFoundError } from "../error/store-not-found-error";

interface ReactivateStoreByIdServiceRequest {
    id: string;
}
interface ReactivateStoreByIdServiceResponse {
    store: Store | null;
    error: Error | null;
}

export class ReactivateStoreByIdService {
    constructor(private storeRepository: StoreRepository) { }

    async execute({ id }: ReactivateStoreByIdServiceRequest): Promise<ReactivateStoreByIdServiceResponse> {
        // Verificar se a loja existe
        const storeExists = await this.storeRepository.findById(id);
        if (!storeExists) {
            return { store: null, error: new StoreNotFoundError() };
        }

        // Reativar a loja
        const store = await this.storeRepository.reactivate(id);
        return {
            store,
            error: null
        };
    }
}
