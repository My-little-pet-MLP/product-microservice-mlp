import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { UpdateProductInOrdersService } from "../../../service/product-in-orders/update-product-in-orders.service";
import { ProductInOrderRepositoryPrisma } from "../../../repository/prisma-repository/product-in-order-repository-prisma";
import { OrderRepositoryPrisma } from "../../../repository/prisma-repository/order-repository-prisma";
import { ProductRepositoryPrisma } from "../../../repository/prisma-repository/product-repository-prisma";
import { OrderNotFoundError } from "../../../service/error/order-not-found-error";
import { ProductNotFoundError } from "../../../service/error/product-not-found-error";
import { QuantityIsNegativeError } from "../../../service/error/quantity-is-negative-error";
import { OrderIsNotPedingError } from "../../../service/error/order-is-not-peding-error";

export async function UpdateProductInOrdersController(req: FastifyRequest, res: FastifyReply) {
    // Validação do corpo da requisição usando Zod
    const updateProductInOrdersBodySchema = z.object({
        id: z.string(),
        customer_id: z.string(),
        product_id: z.string(),
        quantity: z.number().int().min(0, "quantity >= 0"),
    });

    // Faz o parsing e validação da requisição
    const { id, customer_id, product_id, quantity } = updateProductInOrdersBodySchema.parse(req.body);

    // Instancia os repositórios necessários
    const productInOrdersRepository = new ProductInOrderRepositoryPrisma();
    const orderRepository = new OrderRepositoryPrisma();
    const productRepository = new ProductRepositoryPrisma();

    // Instancia o serviço
    const updateProductInOrdersService = new UpdateProductInOrdersService(
        productInOrdersRepository,
        orderRepository,
        productRepository
    );

    // Executa o serviço de atualização de produtos no pedido
    const { productInOrders, error } = await updateProductInOrdersService.execute({
        id,
        customerId: customer_id,
        productId: product_id,
        quantity
    });

    // Tratamento de erros
    if (error) {
        if (error instanceof OrderNotFoundError || error instanceof ProductNotFoundError) {
            return res.status(404).send({ message: error.message });
        }
        if (error instanceof QuantityIsNegativeError) {
            return res.status(400).send({ message: error.message });
        }
        if (error instanceof OrderIsNotPedingError) {
            return res.status(400).send({ message: error.message });
        }
        
        // Erro inesperado, log para debug e resposta de erro interno
        console.log("Internal Server Error in UpdateProductInOrdersController: " + error.message);
        return res.status(500).send({ message: "Internal Server Error" });
    }

    // Resposta de sucesso
    return res.status(200).send(productInOrders);
}
