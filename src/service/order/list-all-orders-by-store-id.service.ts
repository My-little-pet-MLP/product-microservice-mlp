import { Order } from "@prisma/client";
import { OrderRepository } from "../../repository/order-repository";
import { StoreRepository } from "../../repository/store-repository";
import { StoreNotFoundError } from "../error/store-not-found-error";

interface ListAllOrdersByStoreIdServiceRequest {
    storeId: string;
    page: number;
    size: number;
}

interface ListAllOrdersByStoreIdServiceResponse {
    orders: Order[] | null;
    totalPages: number | null;
    error: Error | null;
}

export class ListAllOrdersByStoreIdService {
    constructor(
        private orderRepository: OrderRepository,
        private storeRepository: StoreRepository
    ) { }

    async execute({ storeId, page, size }: ListAllOrdersByStoreIdServiceRequest): Promise<ListAllOrdersByStoreIdServiceResponse> {
        // Verificar se a loja existe
        const storeExists = await this.storeRepository.findById(storeId);
        if (!storeExists) {
            return { orders: null, totalPages: null, error: new StoreNotFoundError() };
        }
        // Contar o número total de pedidos da loja
        const totalOrders = await this.orderRepository.countOrdersByStoreId(storeId);
        const totalPages = Math.ceil(totalOrders / size); // Calcular o número de páginas

        // Buscar os pedidos paginados
        const orders = await this.orderRepository.listAllByStoreId(storeId, page, size);

        return { orders, totalPages, error: null };
    }
}
