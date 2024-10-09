import { FastifyInstance } from "fastify";

import { GetByIdOrderController } from "../controller/orders/get-by-id-order.controller";
import { ListAllOrdersByCustomerIdController } from "../controller/orders/list-all-order-by-customer-id.controller";
import { RegisterOrderController } from "../controller/orders/register-order.controller";
import { UpdateOrderController } from "../controller/orders/update-order.controller";
import { ConfirmOrderController } from "../controller/orders/confirm-order.controller";
import { ListAllOrdersByStoreIdController } from "../controller/orders/list-all-orders-by-store-id.controller";
import { VerifyCustomerHavePedingOrderService } from "../../service/order/verify-customer-have-peding-order.service";
import { VerifyCustomerHaveOrderController } from "../controller/orders/verify-customer-have-order.controller";



export async function OrderRouter(app: FastifyInstance) {
    app.get("/:id", {
        schema: {
            description: 'Obter um pedido específico pelo ID',
            tags: ['Pedido'],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'ID do pedido' }
                },
                required: ['id']
            },
            response: {
                200: {
                    description: 'Pedido encontrado com sucesso',
                    type: 'object',
                    properties: {
                        id: { type: 'string', description: 'ID do pedido' },
                        fullPriceOrderInCents: { type: 'number', description: 'Preço total do pedido em centavos' },
                        storeId: { type: 'string', description: 'ID da loja' },
                        status: { type: 'string', description: 'Status do pedido' },
                        customerIdStripe: { type: 'string', description: 'ID do cliente no Stripe' },
                        customerId: { type: 'string', description: 'ID do cliente' },
                        created_at: { type: 'string', format: 'date-time', description: 'Data de criação do pedido' },
                        updated_at: { type: 'string', format: 'date-time', description: 'Data de atualização do pedido' }
                    },
                    example: {
                        id: '12345',
                        fullPriceOrderInCents: 5000,
                        storeId: '67890',
                        status: 'PENDING',
                        customerIdStripe: 'cus_ABC123',
                        customerId: 'cust_98765',
                        created_at: '2024-10-06T10:00:00Z',
                        updated_at: '2024-10-06T12:00:00Z'
                    }
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
    }, GetByIdOrderController);
    app.get("/listAllByCustomerId", {
        schema: {
            description: 'Listar todos os pedidos de um cliente específico pelo ID do cliente',
            tags: ['Pedido'],
            querystring: {
                type: 'object',
                properties: {
                    customer_id: { type: 'string', description: 'ID do cliente' },
                    page: { type: 'integer', description: 'Número da página', minimum: 1 },
                    size: { type: 'integer', description: 'Tamanho da página', minimum: 1 }
                },
                required: ['customer_id', 'page', 'size']
            },
            response: {
                200: {
                    description: 'Pedidos encontrados com sucesso',
                    type: 'object',
                    properties: {
                        orders: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string', description: 'ID do pedido' },
                                    fullPriceOrderInCents: { type: 'number', description: 'Preço total do pedido em centavos' },
                                    storeId: { type: 'string', description: 'ID da loja' },
                                    status: { type: 'string', description: 'Status do pedido' },
                                    customerIdStripe: { type: 'string', description: 'ID do cliente no Stripe' },
                                    customerId: { type: 'string', description: 'ID do cliente' },
                                    created_at: { type: 'string', format: 'date-time', description: 'Data de criação do pedido' },
                                    updated_at: { type: 'string', format: 'date-time', description: 'Data de atualização do pedido' }
                                }
                            }
                        },
                        totalPages: { type: 'integer', description: 'Total de páginas' },
                        currentPage: { type: 'integer', description: 'Página atual' }
                    },
                    example: {
                        orders: [
                            {
                                id: '12345',
                                fullPriceOrderInCents: 5000,
                                storeId: '67890',
                                status: 'PENDING',
                                customerIdStripe: 'cus_ABC123',
                                customerId: 'cust_98765',
                                created_at: '2024-10-06T10:00:00Z',
                                updated_at: '2024-10-06T12:00:00Z'
                            },
                            {
                                id: '67890',
                                fullPriceOrderInCents: 12000,
                                storeId: '54321',
                                status: 'COMPLETED',
                                customerIdStripe: 'cus_DEF456',
                                customerId: 'cust_98765',
                                created_at: '2024-10-07T10:00:00Z',
                                updated_at: '2024-10-07T12:00:00Z'
                            }
                        ],
                        totalPages: 5,
                        currentPage: 1
                    }
                },
                404: {
                    description: 'Pedidos não encontrados',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    },
                    example: {
                        message: 'Orders not found'
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
    }, ListAllOrdersByCustomerIdController);

    app.post("/", {
        schema: {
            description: 'Registrar um novo pedido',
            tags: ['Pedido'],
            body: {
                type: 'object',
                properties: {
                    store_id: { type: 'string', description: 'ID da loja' },
                    customer_id: { type: 'string', description: 'ID do cliente' },
                    customer_id_stripe: { type: 'string', description: 'ID do cliente no Stripe' }
                },
                required: ['store_id', 'customer_id', 'customer_id_stripe']
            },
            response: {
                200: {
                    description: 'Pedido registrado com sucesso',
                    type: 'object',
                    properties: {
                        id: { type: 'string', description: 'ID do pedido' },
                        fullPriceOrderInCents: { type: 'number', description: 'Preço total do pedido em centavos' },
                        storeId: { type: 'string', description: 'ID da loja' },
                        status: { type: 'string', description: 'Status do pedido' },
                        customerIdStripe: { type: 'string', description: 'ID do cliente no Stripe' },
                        customerId: { type: 'string', description: 'ID do cliente' },
                        created_at: { type: 'string', format: 'date-time', description: 'Data de criação do pedido' },
                        updated_at: { type: 'string', format: 'date-time', description: 'Data de atualização do pedido' }
                    },
                    example: {
                        id: '12345',
                        fullPriceOrderInCents: 5000,
                        storeId: '67890',
                        status: 'PENDING',
                        customerIdStripe: 'cus_ABC123',
                        customerId: 'cust_98765',
                        created_at: '2024-10-06T10:00:00Z',
                        updated_at: '2024-10-06T12:00:00Z'
                    }
                },
                404: {
                    description: 'Loja não encontrada',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    },
                    example: {
                        message: 'Store not found'
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
    }, RegisterOrderController);


    app.put("/", {
        schema: {
            description: 'Atualizar o status de um pedido',
            tags: ['Pedido'],
            body: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'ID do pedido' },
                    status: {
                        type: 'string',
                        description: 'Novo status do pedido',
                        enum: [
                            "pending",
                            "awaiting_payment",
                            "payment_confirmed",
                            "processing",
                            "shipped",
                            "delivered",
                            "canceled",
                            "returned"
                        ]
                    }
                },
                required: ['id', 'status']
            },
            response: {
                200: {
                    description: 'Pedido atualizado com sucesso',
                    type: 'object',
                    properties: {
                        order: {
                            type: 'object',
                            properties: {
                                id: { type: 'string', description: 'ID do pedido' },
                                fullPriceOrderInCents: { type: 'number', description: 'Preço total do pedido em centavos' },
                                storeId: { type: 'string', description: 'ID da loja' },
                                status: { type: 'string', description: 'Status do pedido' },
                                customerIdStripe: { type: 'string', description: 'ID do cliente no Stripe' },
                                customerId: { type: 'string', description: 'ID do cliente' },
                                created_at: { type: 'string', format: 'date-time', description: 'Data de criação do pedido' },
                                updated_at: { type: 'string', format: 'date-time', description: 'Data de atualização do pedido' }
                            }
                        }
                    },
                    example: {
                        order: {
                            id: '12345',
                            fullPriceOrderInCents: 5000,
                            storeId: '67890',
                            status: 'shipped',
                            customerIdStripe: 'cus_ABC123',
                            customerId: 'cust_98765',
                            created_at: '2024-10-06T10:00:00Z',
                            updated_at: '2024-10-07T12:00:00Z'
                        }
                    }
                },
                404: {
                    description: 'Pedido não encontrado',
                    type: 'object',
                    properties: {
                        error: { type: 'string' }
                    },
                    example: {
                        error: 'Order not found'
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
    }, UpdateOrderController);
    app.put("/confirmorder/:id", {
        schema: {
            description: 'Confirmar um pedido, verificando estoque e atualizando o status',
            tags: ['Pedido'],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'ID do pedido' }
                },
                required: ['id']
            },
            response: {
                200: {
                    description: 'Pedido confirmado com sucesso',
                    type: 'object',
                    properties: {
                        order: {
                            type: 'object',
                            properties: {
                                id: { type: 'string', description: 'ID do pedido' },
                                fullPriceOrderInCents: { type: 'number', description: 'Preço total do pedido em centavos' },
                                storeId: { type: 'string', description: 'ID da loja' },
                                status: { type: 'string', description: 'Status do pedido' },
                                customerIdStripe: { type: 'string', description: 'ID do cliente no Stripe' },
                                customerId: { type: 'string', description: 'ID do cliente' },
                                created_at: { type: 'string', format: 'date-time', description: 'Data de criação do pedido' },
                                updated_at: { type: 'string', format: 'date-time', description: 'Data de atualização do pedido' }
                            }
                        }
                    },
                    example: {
                        order: {
                            id: '12345',
                            fullPriceOrderInCents: 10000,
                            storeId: '54321',
                            status: 'CONFIRMED',
                            customerIdStripe: 'cus_ABC123',
                            customerId: 'cust_98765',
                            created_at: '2024-10-07T10:00:00Z',
                            updated_at: '2024-10-07T12:00:00Z'
                        }
                    }
                },
                404: {
                    description: 'Pedido ou produto não encontrado',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    },
                    example: {
                        message: 'Order not found'
                    }
                },
                400: {
                    description: 'Estoque insuficiente',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    },
                    example: {
                        message: 'Insufficient stock for product'
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
    }, ConfirmOrderController);

    app.get("/listAllByStoreId", {
        schema: {
            description: 'Listar todos os pedidos de uma loja específica pelo ID da loja',
            tags: ['Pedido'],
            querystring: {
                type: 'object',
                properties: {
                    store_id: { type: 'string', description: 'ID da loja' },
                    page: { type: 'integer', description: 'Número da página', minimum: 1 },
                    size: { type: 'integer', description: 'Tamanho da página', minimum: 1 }
                },
                required: ['store_id', 'page', 'size']
            },
            response: {
                200: {
                    description: 'Pedidos encontrados com sucesso',
                    type: 'object',
                    properties: {
                        orders: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string', description: 'ID do pedido' },
                                    fullPriceOrderInCents: { type: 'number', description: 'Preço total do pedido em centavos' },
                                    storeId: { type: 'string', description: 'ID da loja' },
                                    status: { type: 'string', description: 'Status do pedido' },
                                    customerIdStripe: { type: 'string', description: 'ID do cliente no Stripe' },
                                    customerId: { type: 'string', description: 'ID do cliente' },
                                    created_at: { type: 'string', format: 'date-time', description: 'Data de criação do pedido' },
                                    updated_at: { type: 'string', format: 'date-time', description: 'Data de atualização do pedido' }
                                }
                            }
                        },
                        totalPages: { type: 'integer', description: 'Total de páginas' },
                        currentPage: { type: 'integer', description: 'Página atual' }
                    },
                    example: {
                        orders: [
                            {
                                id: '12345',
                                fullPriceOrderInCents: 10000,
                                storeId: '54321',
                                status: 'PENDING',
                                customerIdStripe: 'cus_ABC123',
                                customerId: 'cust_98765',
                                created_at: '2024-10-07T10:00:00Z',
                                updated_at: '2024-10-07T12:00:00Z'
                            },
                            {
                                id: '67890',
                                fullPriceOrderInCents: 20000,
                                storeId: '54321',
                                status: 'SHIPPED',
                                customerIdStripe: 'cus_DEF456',
                                customerId: 'cust_98765',
                                created_at: '2024-10-07T10:30:00Z',
                                updated_at: '2024-10-07T12:30:00Z'
                            }
                        ],
                        totalPages: 5,
                        currentPage: 1
                    }
                },
                404: {
                    description: 'Loja não encontrada',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    },
                    example: {
                        message: 'Store not found'
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
    }, ListAllOrdersByStoreIdController);

    app.get("/verifycustomerHaveOrderPending", {
        schema: {
            description: 'Verificar se um cliente tem um pedido pendente em uma loja específica',
            tags: ['Pedido'],
            querystring: {
                type: 'object',
                properties: {
                    customer_id: { type: 'string', description: 'ID do cliente' },
                    store_id: { type: 'string', description: 'ID da loja' }
                },
                required: ['customer_id', 'store_id']
            },
            response: {
                200: {
                    description: 'Pedido pendente encontrado com sucesso',
                    type: 'object',
                    properties: {
                        order: {
                            type: 'object',
                            properties: {
                                id: { type: 'string', description: 'ID do pedido' },
                                fullPriceOrderInCents: { type: 'number', description: 'Preço total do pedido em centavos' },
                                storeId: { type: 'string', description: 'ID da loja' },
                                status: { type: 'string', description: 'Status do pedido' },
                                customerIdStripe: { type: 'string', description: 'ID do cliente no Stripe' },
                                customerId: { type: 'string', description: 'ID do cliente' },
                                created_at: { type: 'string', format: 'date-time', description: 'Data de criação do pedido' },
                                updated_at: { type: 'string', format: 'date-time', description: 'Data de atualização do pedido' }
                            }
                        }
                    },
                    example: {
                        order: {
                            id: '12345',
                            fullPriceOrderInCents: 10000,
                            storeId: '54321',
                            status: 'PENDING',
                            customerIdStripe: 'cus_ABC123',
                            customerId: 'cust_98765',
                            created_at: '2024-10-07T10:00:00Z',
                            updated_at: '2024-10-07T12:00:00Z'
                        }
                    }
                },
                404: {
                    description: 'Nenhum pedido pendente encontrado',
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
    }, VerifyCustomerHaveOrderController);
}