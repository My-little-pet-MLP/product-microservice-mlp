import { ProductInOrders } from "@prisma/client";
import { ProductInOrderRepository } from "../../repository/product-in-order-repository";
import { OrderRepository } from "../../repository/order-repository";
import { ProductRepostory } from "../../repository/product-repository";
import { ProductNotFoundError } from "../error/product-not-found-error";
import { QuantityIsNegativeError } from "../error/quantity-is-negative-error";
import { OrderIsNotPedingError } from "../error/order-is-not-peding-error";
import { clearkClientCustomer } from "../../lib/cleark";
import { CustomerNotFoundError } from "../error/customer-not-found-error";
import { ErrorFetchingCustomerError } from "../error/error-fetchig-customer-error";
import { FailedToRegisterProductInOrderError } from "../error/failed-to-register-product-in-order-error";

interface RegisterProductInOrdersServiceRequest {
    customerId: string;
    productId: string;
    quantity: number;
}

interface RegisterProductInOrdersServiceResponse {
    productInOrders: ProductInOrders | null;
    error: Error | null;
}

export class RegisterProductInOrdersService {
    constructor(
        private productInOrdersRepository: ProductInOrderRepository,
        private orderRepository: OrderRepository,
        private productRepository: ProductRepostory
    ) {}

    async execute({
        productId,
        quantity,
        customerId,
    }: RegisterProductInOrdersServiceRequest): Promise<RegisterProductInOrdersServiceResponse> {
        // Verifica se o cliente existe
        try {
            const customerExists = await clearkClientCustomer.users.getUser(customerId);
            if (!customerExists) {
                return { productInOrders: null, error: new CustomerNotFoundError() };
            }
        } catch (error) {
            return { productInOrders: null, error: new ErrorFetchingCustomerError() };
        }

        // Verifica se o produto existe e está ativo
        const productExists = await this.productRepository.getById(productId);
        if (!productExists || !productExists.isActive) {
            return { productInOrders: null, error: new ProductNotFoundError() };
        }

        // Verifica se a quantidade é válida
        if (quantity < 0) {
            return { productInOrders: null, error: new QuantityIsNegativeError() };
        }

        // Verifica se o cliente tem um pedido pendente na mesma loja
        const existingOrder = await this.orderRepository.verifyCustomerHavePedingOrder(customerId, productExists.storeId);

        let orderId: string;
        if (!existingOrder) {
            // Cria novo pedido se não houver nenhum pendente
            const newOrder = await this.orderRepository.register({
                customerId,
                fullPriceOrderInCents: productExists.priceInCents * quantity,
                status: "pending",
                storeId: productExists.storeId,
            });
            orderId = newOrder.id;
        } else {
            // Se já houver um pedido, verifica o status
            if (existingOrder.status !== "pending") {
                // Se o status for diferente de 'pending', cria um novo pedido pendente
                const newOrder = await this.orderRepository.register({
                    customerId,
                    fullPriceOrderInCents: productExists.priceInCents * quantity,
                    status: "pending",
                    storeId: productExists.storeId,
                });
                orderId = newOrder.id;
            } else {
                // Se o pedido existente estiver no status 'pending', reutiliza o mesmo pedido
                orderId = existingOrder.id;
            }
        }

        // Registra o produto no pedido
        const productInOrders = await this.productInOrdersRepository.register({
            orderId,
            productId,
            quantity,
        });

        if (!productInOrders) {
            return { productInOrders: null, error: new FailedToRegisterProductInOrderError() };
        }

        return { productInOrders, error: null };
    }
}
    