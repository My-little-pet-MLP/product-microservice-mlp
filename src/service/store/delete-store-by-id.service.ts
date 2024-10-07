import { StoreRepository } from "../../repository/store-repository";

interface DeleteStoreByIdServiceRequest {
    id: string;
}
interface DeleteStoreByIdServiceResponse {

}

export class DeleteStoreByIdService {
    constructor(private storeRepository: StoreRepository) { }

    async execute({ id }: DeleteStoreByIdServiceRequest): Promise<DeleteStoreByIdServiceResponse> {
        await this.storeRepository.delete(id);
        return {}
    }
}