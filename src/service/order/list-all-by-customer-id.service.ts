import { Order } from "@prisma/client";
import { OrderRepository } from "../../repository/order-repository";
import { clearkClientCustomer } from "../../lib/cleark";
import { CustomerNotFoundError } from "../error/customer-not-found-error";

interface ListAllByCustomerIdServiceRequest {
    customerId: string;
    page: number;
    size: number;
}
interface ListAllByCustomerIdServiceResponse {
    orders: Order[] | null;
    totalPages: number | null;
    error: Error | null;
}

export class ListAllByCustomerIdService {
    constructor(private orderRepository: OrderRepository) { }

    async execute({ customerId, page, size }: ListAllByCustomerIdServiceRequest): Promise<ListAllByCustomerIdServiceResponse> {
        // Verificar se o cliente existe
        const UserClearkExists = await clearkClientCustomer.users.getUser(customerId);
        if (!UserClearkExists) {
            return { orders: null, totalPages: null, error: new CustomerNotFoundError() };
        }

        // Contar o número total de pedidos do cliente
        const totalOrders = await this.orderRepository.countOrdersByCustomerId(customerId);
        const totalPages = Math.ceil(totalOrders / size); // Calcular o número de páginas

        // Buscar os pedidos paginados
        const orders = await this.orderRepository.listAllByCustomerId(customerId, page, size);

        return { orders, totalPages, error: null };
    }
}
