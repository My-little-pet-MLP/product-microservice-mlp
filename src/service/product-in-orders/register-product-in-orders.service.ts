import { ProductInOrders } from "@prisma/client";
import { ProductInOrderRepository } from "../../repository/product-in-order-repository";
import { OrderRepository } from "../../repository/order-repository";
import { ProductRepostory } from "../../repository/product-repository";
import { ProductNotFoundError } from "../error/product-not-found-error";
import { QuantityIsNegativeError } from "../error/quantity-is-negative-error";
import { clearkClientCustomer } from "../../lib/cleark";
import { CustomerNotFoundError } from "../error/customer-not-found-error";
import { ErrorFetchingCustomerError } from "../error/error-fetchig-customer-error";

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
    ) { }

    async execute({
        customerId,
        productId,
        quantity,
    }: RegisterProductInOrdersServiceRequest): Promise<RegisterProductInOrdersServiceResponse> {
        try {
            const customerExists = await clearkClientCustomer.users.getUser(customerId);
            if (!customerExists) {
                return { productInOrders: null, error: new CustomerNotFoundError() };
            }
        } catch (error) {
            return { productInOrders: null, error: new ErrorFetchingCustomerError() };
        }

        const product = await this.productRepository.getById(productId);
        if (!product || !product.isActive) {
            return { productInOrders: null, error: new ProductNotFoundError() };
        }

        if (quantity < 0) {
            return { productInOrders: null, error: new QuantityIsNegativeError() };
        }

        let order = await this.orderRepository.verifyCustomerHavePedingOrder(
            customerId,
            product.storeId
        );

        if (!order) {
            order = await this.orderRepository.register({
                customerId,
                fullPriceOrderInCents: 0,
                status: "pending",
                storeId: product.storeId,
            });
        }

        let productInOrder = await this.productInOrdersRepository.getByOrderAndProductId(
            order.id,
            productId
        );

        if (productInOrder) {
            const newQuantity = productInOrder.quantity + quantity;
            if (newQuantity < 0) {
                return { productInOrders: null, error: new QuantityIsNegativeError() };
            }

            productInOrder = await this.productInOrdersRepository.update( productInOrder.id, newQuantity);
        } else {
            productInOrder = await this.productInOrdersRepository.register({
                orderId: order.id,
                productId,
                quantity,
            });
        }

        const updatedFullPrice = await this.calculateFullPrice(order.id);
        await this.orderRepository.updateFullPrice(order.id, updatedFullPrice);

        return { productInOrders: productInOrder, error: null };
    }

    private async calculateFullPrice(orderId: string): Promise<number> {
        const productsInOrder = await this.productInOrdersRepository.listAllByOrder(orderId) || [];

        const productIds = productsInOrder.map((p) => p.productId);
        const products = await this.productRepository.getByIds(productIds);

        const priceMap = new Map(products.map((p) => [p.id, p.priceInCents]));

        return productsInOrder.reduce((total, productInOrder) => {
            const price = priceMap.get(productInOrder.productId) || 0;
            return total + productInOrder.quantity * price;
        }, 0);
    }
}
