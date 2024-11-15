import { FastifyInstance } from "fastify";
import { GrantCouponToCustomerByIdController } from "../controller/cupons/grant-coupon-to-customer-by-id.controller";
import { RegisterCupomController } from "../controller/cupons/register-cupom.controller";
import { ListAllCupomByCustomerIdAndStoreIdController } from "../controller/cupons/list-by-customer-id.controller";
import { ListAllCouponByStoreIdController } from "../controller/cupons/list-all-coupon-by-store-id.controller";

export async function CupomRouter(app: FastifyInstance) {
    app.put("/grant-coupon-to-customer/:customer_id", {
        schema: {
            description: "Concede um cupom a um cliente específico.",
            tags: ["Cupom"],
            summary: "Concede um cupom a um cliente",
            params: {
                type: "object",
                properties: {
                    customer_id: { type: "string", description: "ID do cliente" }
                },
                required: ["customer_id"]
            },
            response: {
                200: {
                    description: "Cupom concedido com sucesso ao cliente",
                    type: "object",
                    properties: {
                        id: { type: "string", description: "ID do cupom" },
                        description: { type: "string", description: "Descrição do cupom" },
                        porcentagem: { type: "number", description: "Percentual de desconto do cupom" },
                        createdAt: { type: "string", format: "date-time", description: "Data de criação do cupom" },
                        ValidateAt: { type: "string", format: "date-time", description: "Data de validade do cupom" },
                        isValid: { type: "boolean", description: "Status de validade do cupom" },
                        storeId: { type: "string", description: "ID da loja" },
                        customerId: { type: "string", description: "ID do cliente" }
                    },
                    example: {
                        id: "CUP123",
                        description: "Desconto de 10%",
                        porcentagem: 10,
                        createdAt: "2024-10-01T10:00:00Z",
                        ValidateAt: "2024-12-31T23:59:59Z",
                        isValid: true,
                        storeId: "STORE123",
                        customerId: "cust_98765"
                    }
                },
                404: {
                    description: "Cliente ou cupom não encontrado",
                    type: "object",
                    properties: {
                        message: { type: "string" }
                    },
                    example: {
                        message: "Customer not found"
                    }
                },
                400: {
                    description: "Erro ao buscar informações do cliente",
                    type: "object",
                    properties: {
                        message: { type: "string" }
                    },
                    example: {
                        message: "Error fetching customer information"
                    }
                },
                500: {
                    description: "Erro interno do servidor",
                    type: "object",
                    properties: {
                        message: { type: "string" }
                    },
                    example: {
                        message: "Internal Server Error"
                    }
                }
            }
        }
    }, GrantCouponToCustomerByIdController);

    app.post("/", {
        schema: {
            description: "Registra um novo cupom para uma loja específica.",
            tags: ["Cupom"],
            summary: "Registra um novo cupom",
            body: {
                type: "object",
                properties: {
                    store_id: { type: "string", description: "ID da loja" },
                    description: { type: "string", description: "Descrição do cupom", maxLength: 144 },
                    percentage: { type: "integer", description: "Percentual de desconto do cupom (1 a 100)", minimum: 1, maximum: 100 },
                    validateAt: { type: "string", format: "date-time", description: "Data de validade do cupom (formato: 2024-12-31T23:59:59Z)" },
                    quantity: { type: "integer", description: "Quantidade de cupons a serem criados", minimum: 1 }
                },
                required: ["store_id", "description", "percentage", "validateAt", "quantity"]
            },
            response: {
                200: {
                    description: "Cupom registrado com sucesso",
                    type: "object",
                    properties: {
                        cupomInfo: {
                            type: "object",
                            properties: {
                                storeId: { type: "string", description: "ID da loja" },
                                description: { type: "string", description: "Descrição do cupom" },
                                porcentagem: { type: "integer", description: "Percentual de desconto" },
                                isValid: { type: "boolean", description: "Status de validade do cupom" },
                                ValidateAt: { type: "string", format: "date-time", description: "Data de validade do cupom" }
                            }
                        },
                        quantityCreated: { type: "integer", description: "Número de cupons criados" }
                    },
                    example: {
                        cupomInfo: {
                            storeId: "STORE123",
                            description: "Desconto de 10%",
                            porcentagem: 10,
                            isValid: true,
                            ValidateAt: "2024-12-31T23:59:59Z"
                        },
                        quantityCreated: 10
                    }
                },
                400: {
                    description: "Erro de validação nos dados do cupom",
                    type: "object",
                    properties: {
                        message: { type: "string" }
                    },
                    example: {
                        message: "format invalid, correct: 2024-12-31T23:59:59Z"
                    }
                },
                404: {
                    description: "Loja não encontrada",
                    type: "object",
                    properties: {
                        message: { type: "string" }
                    },
                    example: {
                        message: "Store not found"
                    }
                },
                500: {
                    description: "Erro interno do servidor",
                    type: "object",
                    properties: {
                        message: { type: "string" }
                    },
                    example: {
                        message: "Internal Server Error"
                    }
                }
            }
        }
    }, RegisterCupomController);
    app.get("/list-all-by-customer/", {
        schema: {
            description: "List all coupons for a specific customer and store.",
            tags: ["Cupom"],
            summary: "List all coupons by customer and store",
            querystring: {
                type: "object",
                properties: {
                    store_id: { type: "string", description: "Store ID" },
                    customer_id: { type: "string", description: "Customer ID" }
                },
                required: ["store_id", "customer_id"]
            },
            response: {
                200: {
                    description: "Coupons successfully retrieved",
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "string", description: "Coupon ID" },
                            description: { type: "string", description: "Coupon description" },
                            porcentagem: { type: "number", description: "Discount percentage" },
                            createdAt: { type: "string", format: "date-time", description: "Coupon creation date" },
                            ValidateAt: { type: "string", format: "date-time", description: "Coupon expiration date" },
                            isValid: { type: "boolean", description: "Coupon validity status" },
                            storeId: { type: "string", description: "Store ID" },
                            customerId: { type: "string", description: "Customer ID" }
                        }
                    },
                    example: [
                        {
                            id: "CUP123",
                            description: "10% discount",
                            porcentagem: 10,
                            createdAt: "2024-10-01T10:00:00Z",
                            ValidateAt: "2024-12-31T23:59:59Z",
                            isValid: true,
                            storeId: "STORE123",
                            customerId: "cust_98765"
                        }
                    ]
                },
                404: {
                    description: "Customer or store not found",
                    type: "object",
                    properties: {
                        message: { type: "string" }
                    },
                    example: {
                        message: "Customer or store not found"
                    }
                },
                500: {
                    description: "Internal server error",
                    type: "object",
                    properties: {
                        message: { type: "string" }
                    },
                    example: {
                        message: "Internal Server Error"
                    }
                }
            }
        }
    }, ListAllCupomByCustomerIdAndStoreIdController);

    app.get("/list-all-by-store-id/:store_id", {
        schema: {
            description: "Retrieve all coupons for a specific store by store ID.",
            tags: ["Cupom"],
            summary: "List all coupons by store ID",
            params: {
                type: "object",
                properties: {
                    store_id: { type: "string", description: "Store ID" },
                },
                required: ["store_id"],
            },
            response: {
                200: {
                    description: "Coupons successfully retrieved for the store",
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            cupons: {
                                type: "object",
                                properties: {
                                    description: { type: "string", description: "Coupon description" },
                                    porcentagem: { type: "number", description: "Discount percentage" },
                                    storeId: { type: "string", description: "Store ID" },
                                },
                            },
                            available: { type: "number", description: "Number of available coupons" },
                            delivered: { type: "number", description: "Number of delivered coupons" },
                            totalQuantity: { type: "number", description: "Total number of coupons" },
                        },
                    },
                    example: [
                        {
                            cupons: {
                                description: "10% OFF",
                                porcentagem: 10,
                                storeId: "STORE123",
                            },
                            available: 5,
                            delivered: 15,
                            totalQuantity: 20,
                        },
                    ],
                },
                404: {
                    description: "Store not found",
                    type: "object",
                    properties: {
                        message: { type: "string" },
                    },
                    example: {
                        message: "Store not found",
                    },
                },
                500: {
                    description: "Internal server error",
                    type: "object",
                    properties: {
                        message: { type: "string" },
                    },
                    example: {
                        message: "Internal Server Error",
                    },
                },
            },
        },
    }, ListAllCouponByStoreIdController);
}