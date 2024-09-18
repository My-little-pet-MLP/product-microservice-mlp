import { Store } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { ThereIsNoStoreRegisteredWithThisUserIdError } from "../error/there-is-no-store-registered-with-this-user-id-error";
import { StoreRepository } from "../../repository/store-repository";

interface GetStoreByUserIdServiceRequest {
    userId: string;
}
interface GetStoreByUserIdServiceReply {
    store: Store | null;
    error: Error | null;
}
export class GetStoreByUserIdService {
    constructor(private storeRepository: StoreRepository) { }

    async execute({ userId }: GetStoreByUserIdServiceRequest): Promise<GetStoreByUserIdServiceReply> {
        const store = await this.storeRepository.findStoreByUserId(userId)

        if (!store) {
            console.log(ThereIsNoStoreRegisteredWithThisUserIdError)
            return { store: null, error: new ThereIsNoStoreRegisteredWithThisUserIdError }
        }
        return { store: store, error: null };
    }
}