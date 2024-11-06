import { FastifyInstance } from "fastify";
import { GetByIdPetController } from "../controller/pets/get-by-id.controller";
import { ListAllByCustomerIdController } from "../controller/pets/list-all-by-customer-id.controller";
import { RegisterPetController } from "../controller/pets/register-pet.controller";
import { DeletePetByIdController } from "../controller/pets/delete-pet-by-id.controller";


export async function PetsRouter(app: FastifyInstance) {
    app.get("/:id", {
        schema: {
            description: "Obter informações de um pet específico pelo ID",
            summary: "Busca informações detalhadas de um pet",
            tags: ["Pets"],
            params: {
                type: "object",
                properties: {
                    id: { type: "string", description: "ID do pet" }
                },
                required: ["id"]
            },
            response: {
                200: {
                    description: "Pet encontrado com sucesso",
                    type: "object",
                    properties: {
                        id: { type: "string", description: "ID do pet" },
                        name: { type: "string", description: "Nome do pet" },
                        breed: { type: "string", description: "Raça do pet" },
                        age: { type: "integer", description: "Idade do pet" },
                        imageUrl: { type: "string", description: "URL da imagem do pet" },
                        size: {
                            type: "string",
                            enum: ["mini", "pequeno", "medio", "grande", "gigante"],
                            description: "Porte do pet"
                        },
                        customerId: { type: "string", description: "ID do cliente dono do pet" },
                        isActive: { type: "boolean", description: "Indica se o pet está ativo" }
                    },
                    example: {
                        id: "pet123",
                        name: "Rex",
                        breed: "Golden Retriever",
                        age: 3,
                        imageUrl: "https://example.com/rex.jpg",
                        size: "grande",
                        customerId: "cust123",
                        isActive: true
                    }
                },
                404: {
                    description: "Pet não encontrado",
                    type: "object",
                    properties: {
                        message: { type: "string" }
                    },
                    example: {
                        message: "Pet not found"
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
    }, GetByIdPetController);

    app.get("/list-all-by-customer-id/:customer_id", {
        schema: {
            description: "Listar todos os pets de um cliente específico pelo ID do cliente",
            summary: "Busca todos os pets de um cliente",
            tags: ["Pets"],
            params: {
                type: "object",
                properties: {
                    customer_id: { type: "string", description: "ID do cliente" }
                },
                required: ["customer_id"]
            },
            response: {
                200: {
                    description: "Pets encontrados com sucesso",
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "string", description: "ID do pet" },
                            name: { type: "string", description: "Nome do pet" },
                            breed: { type: "string", description: "Raça do pet" },
                            age: { type: "integer", description: "Idade do pet" },
                            imageUrl: { type: "string", description: "URL da imagem do pet" },
                            size: {
                                type: "string",
                                enum: ["mini", "pequeno", "medio", "grande", "gigante"],
                                description: "Porte do pet"
                            },
                            customerId: { type: "string", description: "ID do cliente dono do pet" },
                            isActive: { type: "boolean", description: "Indica se o pet está ativo" }
                        }
                    },
                    example: [
                        {
                            id: "pet123",
                            name: "Rex",
                            breed: "Golden Retriever",
                            age: 3,
                            imageUrl: "https://example.com/rex.jpg",
                            size: "grande",
                            customerId: "cust123",
                            isActive: true
                        },
                        {
                            id: "pet124",
                            name: "Bella",
                            breed: "Poodle",
                            age: 2,
                            imageUrl: "https://example.com/bella.jpg",
                            size: "medio",
                            customerId: "cust123",
                            isActive: true
                        }
                    ]
                },
                404: {
                    description: "Cliente não encontrado",
                    type: "object",
                    properties: {
                        message: { type: "string" }
                    },
                    example: {
                        message: "Customer not found"
                    }
                },
                400: {
                    description: "Erro ao buscar cliente",
                    type: "object",
                    properties: {
                        message: { type: "string" }
                    },
                    example: {
                        message: "Error fetching customer"
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
    }, ListAllByCustomerIdController);
    app.post("/", {
        schema: {
            description: "Registrar um novo pet",
            summary: "Cadastro de um pet com todas as informações necessárias",
            tags: ["Pets"],
            body: {
                type: "object",
                properties: {
                    name: { type: "string", description: "Nome do pet", minLength: 1 },
                    age: { 
                        type: "integer", 
                        description: "Idade do pet em anos", 
                        minimum: 0, 
                        maximum: 30 
                    },
                    breed: { type: "string", description: "Raça do pet" },
                    size: { 
                        type: "string", 
                        enum: ["mini", "pequeno", "medio", "grande", "gigante"], 
                        description: "Porte do pet" 
                    },
                    imageUrl: { type: "string", format: "url", description: "URL da imagem do pet" },
                    customerId: { type: "string", description: "ID do cliente" }
                },
                required: ["name", "age", "breed", "size", "imageUrl", "customerId"]
            },
            response: {
                200: {
                    description: "Pet registrado com sucesso",
                    type: "object",
                    properties: {
                        id: { type: "string", description: "ID do pet" },
                        name: { type: "string", description: "Nome do pet" },
                        breed: { type: "string", description: "Raça do pet" },
                        age: { type: "integer", description: "Idade do pet" },
                        imageUrl: { type: "string", description: "URL da imagem do pet" },
                        size: { type: "string", description: "Porte do pet" },
                        customerId: { type: "string", description: "ID do cliente" },
                        isActive: { type: "boolean", description: "Status ativo do pet" }
                    },
                    example: {
                        id: "pet123",
                        name: "Rex",
                        breed: "Golden Retriever",
                        age: 3,
                        imageUrl: "https://example.com/rex.jpg",
                        size: "grande",
                        customerId: "cust123",
                        isActive: true
                    }
                },
                404: {
                    description: "Cliente não encontrado",
                    type: "object",
                    properties: {
                        message: { type: "string" }
                    },
                    example: {
                        message: "Customer not found"
                    }
                },
                400: {
                    description: "Erro na validação ou na execução do serviço",
                    type: "object",
                    properties: {
                        message: { type: "string" }
                    },
                    example: {
                        message: "Invalid pet data"
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
    }, RegisterPetController);

    app.delete("/:id", {
        schema: {
            description: "Excluir um pet específico pelo ID",
            summary: "Deleta um pet",
            tags: ["Pets"],
            params: {
                type: "object",
                properties: {
                    id: { type: "string", description: "ID do pet a ser excluído" }
                },
                required: ["id"]
            },
            response: {
                204: {
                    description: "Pet excluído com sucesso",
                    type: "null"
                },
                404: {
                    description: "Pet não encontrado",
                    type: "object",
                    properties: {
                        message: { type: "string" }
                    },
                    example: {
                        message: "Pet not found"
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
    }, DeletePetByIdController);

}
