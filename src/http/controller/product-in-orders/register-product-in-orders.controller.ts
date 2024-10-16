import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ProductInOrderRepositoryPrisma } from "../../../repository/prisma-repository/product-in-order-repository-prisma";
import { OrderRepositoryPrisma } from "../../../repository/prisma-repository/order-repository-prisma";
import { ProductRepositoryPrisma } from "../../../repository/prisma-repository/product-repository-prisma";
import { RegisterProductInOrdersService } from "../../../service/product-in-orders/register-product-in-orders.service";
import { OrderNotFoundError } from "../../../service/error/order-not-found-error";
import { ProductNotFoundError } from "../../../service/error/product-not-found-error";
import { OrderIsNotPedingError } from "../../../service/error/order-is-not-peding-error";
import { QuantityIsNegativeError } from "../../../service/error/quantity-is-negative-error";

export async function registerProductInOrdersController(
    req: FastifyRequest,
    res: FastifyReply
  ) {
    // Validação do corpo da requisição com zod
    const registerProductInOrdersBodySchema = z.object({
      customer_id: z.string().min(1, 'customer_id is required'),
      product_id: z.string().min(1, 'product_id is required'),
      quantity: z.number().int().min(0, 'quantity must be a positive integer'),
    });
  
    const { customer_id, product_id, quantity } = registerProductInOrdersBodySchema.parse(req.body);
  
    const productInOrdersRepository = new ProductInOrderRepositoryPrisma();
    const orderRepository = new OrderRepositoryPrisma();
    const productRepository = new ProductRepositoryPrisma();
  
    const registerProductInOrdersService = new RegisterProductInOrdersService(
      productInOrdersRepository,
      orderRepository,
      productRepository
    );
  
    // Executa o serviço de registro de produtos no pedido
    const { productInOrders, error } = await registerProductInOrdersService.execute({
      customerId: customer_id,
      productId: product_id,
      quantity,
    });
  
    // Tratamento de erros específicos
    if (error) {
      if (error instanceof OrderNotFoundError || error instanceof ProductNotFoundError) {
        return res.status(404).send({ message: error.message });
      }
  
      if (error instanceof OrderIsNotPedingError || error instanceof QuantityIsNegativeError) {
        return res.status(400).send({ message: error.message });
      }
  
      // Erro genérico
      console.error('Internal Server Error:', error);
      return res.status(500).send({ message: 'Internal Server Error!' });
    }
  
    // Retorna sucesso
    return res.status(200).send(productInOrders);
  }