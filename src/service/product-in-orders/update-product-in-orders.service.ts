import { ProductInOrders } from "@prisma/client";
import { ProductInOrderRepository } from "../../repository/product-in-order-repository";
import { QuantityIsNegativeError } from "../error/quantity-is-negative-error";
import { OrderRepository } from "../../repository/order-repository";

interface UpdateProductInOrdersServiceRequest {
    id: string;
  
    quantity: number;
}
interface UpdateProductInOrdersServiceResponse {
    productInOrders: ProductInOrders | null;
    error: Error | null;
}

export class UpdateProductInOrdersService {
    constructor(
        private productInOrdersRepository: ProductInOrderRepository,
        private orderRepository: OrderRepository
    ) {}

    async execute({ id, quantity }: UpdateProductInOrdersServiceRequest): Promise<UpdateProductInOrdersServiceResponse> {
      
        // Verifica se a quantidade é válida
        if (quantity < 0) {
            return { productInOrders: null, error: new QuantityIsNegativeError() };
        }
        // Atualiza o produto no pedido
        const productInOrders = await this.productInOrdersRepository.update(id,quantity);

        return { productInOrders, error: null };
    }
}
