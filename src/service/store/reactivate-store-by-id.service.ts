import { Store } from "@prisma/client";
import { StoreRepository } from "../../repository/store-repository";

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
        const store = await this.storeRepository.reactivate(id);
        return {
            store,
            error: null
        }

    }
}