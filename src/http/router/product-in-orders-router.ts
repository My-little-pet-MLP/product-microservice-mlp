import { FastifyInstance } from "fastify";
import { ListAllByOrderIdController } from "../controller/product-in-orders/list-all-by-order-id.controller";
import { RegisterProductInOrdersController } from "../controller/product-in-orders/register-product-in-orders.controller";
import { GetProductInOrderByIdController } from "../controller/product-in-orders/get-product-in-order-by-id.controller";
import { UpdateProductInOrdersController } from "../controller/product-in-orders/update-product-in-orders.controller";

export async function ProductInOrdersRouter(app: FastifyInstance) {
    app.get("/listallbyorder/:order_id", {
        schema: {
            description: 'Listar todos os produtos de um pedido específico',
            tags: ['Produtos em Pedido'],
            params: {
                type: 'object',
                properties: {
                    order_id: { type: 'string', description: 'ID do pedido' }
                },
                required: ['order_id']
            },
            response: {
                200: {
                    description: 'Produtos listados com sucesso',
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string', description: 'ID do produto no pedido' },
                            productId: { type: 'string', description: 'ID do produto' },
                            quantity: { type: 'number', description: 'Quantidade do produto no pedido' },
                            orderId: { type: 'string', description: 'ID do pedido' },
                            created_at: { type: 'string', format: 'date-time', description: 'Data de criação do item no pedido' },
                            updated_at: { type: 'string', format: 'date-time', description: 'Data de atualização do item no pedido' }
                        }
                    },
                    example: [
                        {
                            id: '1',
                            productId: '12345',
                            quantity: 3,
                            orderId: '67890',
                            created_at: '2024-10-06T10:00:00Z',
                            updated_at: '2024-10-06T12:00:00Z'
                        },
                        {
                            id: '2',
                            productId: '54321',
                            quantity: 1,
                            orderId: '67890',
                            created_at: '2024-10-06T11:00:00Z',
                            updated_at: '2024-10-06T12:00:00Z'
                        }
                    ]
                },
                404: {
                    description: 'Pedido não encontrado',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    },
                    example: {
                        message: 'Order not found'
                    }
                },
                500: {
                    description: 'Erro interno do servidor',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    },
                    example: {
                        message: 'Internal Server Error'
                    }
                }
            }
        }
    }, ListAllByOrderIdController);
    app.get("/:id", {
        schema: {
            description: 'Obter um produto em um pedido específico pelo ID',
            tags: ['Produtos em Pedido'],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'ID do produto no pedido' }
                },
                required: ['id']
            },
            response: {
                200: {
                    description: 'Produto encontrado com sucesso',
                    type: 'object',
                    properties: {
                        id: { type: 'string', description: 'ID do produto no pedido' },
                        productId: { type: 'string', description: 'ID do produto' },
                        quantity: { type: 'number', description: 'Quantidade do produto no pedido' },
                        orderId: { type: 'string', description: 'ID do pedido' },
                        created_at: { type: 'string', format: 'date-time', description: 'Data de criação do item no pedido' },
                        updated_at: { type: 'string', format: 'date-time', description: 'Data de atualização do item no pedido' }
                    },
                    example: {
                        id: '1',
                        productId: '12345',
                        quantity: 2,
                        orderId: '67890',
                        created_at: '2024-10-06T10:00:00Z',
                        updated_at: '2024-10-06T12:00:00Z'
                    }
                },
                404: {
                    description: 'Produto no pedido não encontrado',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    },
                    example: {
                        message: 'Product in order not found'
                    }
                },
                500: {
                    description: 'Erro interno do servidor',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    },
                    example: {
                        message: 'Internal Server Error'
                    }
                }
            }
        }
    }, GetProductInOrderByIdController);

    app.post("/", {
        schema: {
            description: 'Registrar um novo produto em um pedido específico',
            tags: ['Produtos em Pedido'],
            body: {
                type: 'object',
                properties: {
                    customer_id: { type: 'string', description: 'ID do customer' },
                    product_id: { type: 'string', description: 'ID do produto' },
                    quantity: { type: 'integer', description: 'Quantidade do produto no pedido', minimum: 1 }
                },
                required: ['order_id', 'product_id', 'quantity']
            },
            response: {
                200: {
                    description: 'Produto registrado no pedido com sucesso',
                    type: 'object',
                    properties: {
                        id: { type: 'string', description: 'ID do produto no pedido' },
                        productId: { type: 'string', description: 'ID do produto' },
                        quantity: { type: 'number', description: 'Quantidade do produto no pedido' },
                        orderId: { type: 'string', description: 'ID do pedido' },
                        created_at: { type: 'string', format: 'date-time', description: 'Data de criação do item no pedido' },
                        updated_at: { type: 'string', format: 'date-time', description: 'Data de atualização do item no pedido' }
                    },
                    example: {
                        id: '1',
                        productId: '12345',
                        quantity: 5,
                        orderId: '67890',
                        created_at: '2024-10-06T10:00:00Z',
                        updated_at: '2024-10-06T12:00:00Z'
                    }
                },
                404: {
                    description: 'Pedido ou produto não encontrado',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    },
                    example: {
                        message: 'Order or product not found'
                    }
                },
                400: {
                    description: 'Pedido não está pendente ou quantidade é negativa',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    },
                    example: {
                        message: 'Order is not pending or quantity is negative'
                    }
                },
                500: {
                    description: 'Erro interno do servidor',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    },
                    example: {
                        message: 'Internal Server Error!'
                    }
                }
            }
        }
    }, RegisterProductInOrdersController);

    app.put("/", {
        schema: {
            description: 'Atualizar um produto em um pedido específico',
            tags: ['Produtos em Pedido'],
            body: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'ID do produto no pedido' },
                    order_id: { type: 'string', description: 'ID do pedido' },
                    product_id: { type: 'string', description: 'ID do produto' },
                    quantity: { type: 'integer', description: 'Quantidade do produto no pedido', minimum: 0 }
                },
                required: ['id', 'order_id', 'product_id', 'quantity']
            },
            response: {
                200: {
                    description: 'Produto atualizado no pedido com sucesso',
                    type: 'object',
                    properties: {
                        id: { type: 'string', description: 'ID do produto no pedido' },
                        productId: { type: 'string', description: 'ID do produto' },
                        quantity: { type: 'number', description: 'Quantidade do produto no pedido' },
                        orderId: { type: 'string', description: 'ID do pedido' },
                        created_at: { type: 'string', format: 'date-time', description: 'Data de criação do item no pedido' },
                        updated_at: { type: 'string', format: 'date-time', description: 'Data de atualização do item no pedido' }
                    },
                    example: {
                        id: '1',
                        productId: '12345',
                        quantity: 10,
                        orderId: '67890',
                        created_at: '2024-10-06T10:00:00Z',
                        updated_at: '2024-10-06T12:00:00Z'
                    }
                },
                404: {
                    description: 'Pedido ou produto não encontrado',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    },
                    example: {
                        message: 'Order or product not found'
                    }
                },
                400: {
                    description: 'Quantidade inválida',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    },
                    example: {
                        message: 'Quantity must be greater than or equal to 0'
                    }
                },
                500: {
                    description: 'Erro interno do servidor',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    },
                    example: {
                        message: 'Internal Server Error'
                    }
                }
            }
        }
    }, UpdateProductInOrdersController);
}