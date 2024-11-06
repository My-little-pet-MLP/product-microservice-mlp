import { Order } from "@prisma/client";
import { OrderRepository } from "../../repository/order-repository";
import { $Enums } from "@prisma/client";  // Importando o Prisma para utilizar o enum
import { OrderNotFoundError } from "../error/order-not-found-error";

interface UpdateOrderServiceRequest {
    id: string;
    status: $Enums.OrderStatus; // Usando o enum diretamente
    fullPriceOrderInCents:number|undefined;
}

interface UpdateOrderServiceResponse {
    order: Order | null;
    error: Error | null;
}

export class UpdateOrderService {
    constructor(private orderRepository: OrderRepository) { }

    async execute({ id, status ,fullPriceOrderInCents}: UpdateOrderServiceRequest): Promise<UpdateOrderServiceResponse> {
        const orderExists = await this.orderRepository.getById(id);
        if (!orderExists) {
            return { order: null, error: new OrderNotFoundError() };
        }

        const orderRegister = await this.orderRepository.update(id, {
            status,
            fullPriceOrderInCents
        });

        return {
            order: orderRegister,
            error: null
        };
    }
}