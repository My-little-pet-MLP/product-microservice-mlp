import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { UpdateProductInOrdersService } from "../../../service/product-in-orders/update-product-in-orders.service";
import { ProductInOrderRepositoryPrisma } from "../../../repository/prisma-repository/product-in-order-repository-prisma";
import { OrderRepositoryPrisma } from "../../../repository/prisma-repository/order-repository-prisma";
import { QuantityIsNegativeError } from "../../../service/error/quantity-is-negative-error";
import { ProductInOrdersNotFoundError } from "../../../service/error/product-in-orders-not-found-error";

export async function UpdateProductInOrdersController(req: FastifyRequest, res: FastifyReply) {
    // Validação do corpo da requisição usando Zod
    const updateProductInOrdersBodySchema = z.object({
        id: z.string(),
        quantity: z.number().int().min(0, "quantity >= 0"),
    });

    // Faz o parsing e validação da requisição
    const { id, quantity } = updateProductInOrdersBodySchema.parse(req.body);

    // Instancia os repositórios necessários
    const productInOrdersRepository = new ProductInOrderRepositoryPrisma();
    const orderRepository = new OrderRepositoryPrisma();

    // Instancia o serviço
    const updateProductInOrdersService = new UpdateProductInOrdersService(
        productInOrdersRepository,
        orderRepository,
    );

    // Executa o serviço de atualização de produtos no pedido
    const { productInOrders, error } = await updateProductInOrdersService.execute({ id, quantity });

    // Tratamento de erros
    if (error) {
        if (error instanceof QuantityIsNegativeError) {
            return res.status(400).send({ message: error.message });
        }
        if (error instanceof ProductInOrdersNotFoundError) {
            return res.status(404).send({ message: error.message })
        }
        // Erro inesperado, log para debug e resposta de erro interno
        console.log("Internal Server Error in UpdateProductInOrdersController: " + error.message);
        return res.status(500).send({ message: "Internal Server Error" });
    }
    // Resposta de sucesso
    return res.status(200).send(productInOrders);
}
