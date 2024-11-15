import { CupomRepository } from "../../repository/cupom-repository";
import { StoreRepository } from "../../repository/store-repository";
import { StoreNotFoundError } from "../error/store-not-found-error";

interface CouponsByStore {
    description: string;
    porcentagem: number;
    storeId: string;
}
interface ListAllCouponByStore {
    cupons: CouponsByStore | null;
    available: number | null;
    delivered: number | null;
    totalQuantity: number | null;
}

interface ListAllCouponByStoreIdServiceResponse {
    cupons: ListAllCouponByStore[];
    error: Error | null;
}

export class ListAllCouponByStoreIdService {
    constructor(private cupomRepository: CupomRepository, private storeRepository: StoreRepository) { }

    async execute({ storeId }: { storeId: string }): Promise<ListAllCouponByStoreIdServiceResponse> {
        // Verificar se a loja existe
        const storeExists = await this.storeRepository.findById(storeId);
        if (!storeExists) {
            return {
                cupons: [],
                error: new StoreNotFoundError(),
            };
        }

        // Buscar os cupons únicos para a loja
        const couponsByStore = await this.cupomRepository.listAllCouponByStore(storeId);

        // Montar a lista de resposta
        const responseList: ListAllCouponByStore[] = [];
        for (const coupon of couponsByStore) {
            const available = await this.cupomRepository.countCouponWhereCustomerIdIsNullAndStoreId(storeId, coupon.description);
            const delivered = await this.cupomRepository.countCouponWhereCustomerIdNotNullAndStoreId(storeId,coupon.description);
            const totalQuantity = available + delivered;

            responseList.push({
                cupons: {
                    description: coupon.description,
                    porcentagem: coupon.porcentagem,
                    storeId: coupon.storeId,
                },
                available,
                delivered,
                totalQuantity,
            });
        }

        return {
            cupons: responseList,
            error: null,
        };
    }
}
