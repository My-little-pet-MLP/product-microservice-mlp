import { Order, Product } from "@prisma/client";
import { OrderRepository } from "../../repository/order-repository";
import { ProductRepostory } from "../../repository/product-repository";
import { InvalidStatusError } from "../error/invalid-status-error";
import { ProductNotFoundError } from "../error/product-not-found-error";

interface UpdateOrderServiceRequest {
    id: string;
    status: string;
    productsid: string[];
}

interface UpdateOrderServiceResponse {
    order: Order | null;
    error: Error | null;
}

export namespace $Enums {
    export const OrderStatus = {
        pending: 'pending',
        awaiting_payment: 'awaiting_payment',
        payment_confirmed: 'payment_confirmed',
        processing: 'processing',
        shipped: 'shipped',
        delivered: 'delivered',
        canceled: 'canceled',
        returned: 'returned'
    } as const;

    export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];
}

export class UpdateOrderService {
    constructor(
        private orderRepository: OrderRepository,
        private productRepository: ProductRepostory
    ) { }

    async execute({
        id,
        productsid,
        status
    }: UpdateOrderServiceRequest): Promise<UpdateOrderServiceResponse> {
        // Verificar se o status está dentro dos valores permitidos
        if (!Object.values($Enums.OrderStatus).includes(status as $Enums.OrderStatus)) {
            return { order: null, error: new InvalidStatusError };
        }

        // Buscar os produtos pelos IDs fornecidos e verificar se existem
        const productList: Product[] = [];
        let fullPriceOrderInCents = 0; // Variável para armazenar o preço total

        for (const productId of productsid) {
            const product = await this.productRepository.getById(productId);
            if (!product) {
                return { order: null, error: new ProductNotFoundError };
            }
            productList.push(product);
            fullPriceOrderInCents += product.priceInCents; // Somar o preço de cada produto
        }

        // Atualizar a ordem com o preço total e os produtos conectados via IDs
        const order = await this.orderRepository.update(id, {
            fullPriceOrderInCents, // Preço total calculado
            Products: {
                connect: productsid.map((productId) => ({ id: productId })), // Conectar produtos usando IDs
            },
            status: status as $Enums.OrderStatus, // Cast para o tipo correto
        });

        return { order, error: null };
    }
}
