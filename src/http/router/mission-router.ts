import { FastifyInstance } from "fastify";
import { GenerateMissionsInDateController } from "../controller/missions/generate-missions-in-date.controller";

export async function MissionRouter(app: FastifyInstance) {
    app.get("/generate-missions-in-date/:customer_id", {
        schema: {
            description: "Gerar missões para um cliente específico em uma data",
            summary: "Geração de missões diárias para um cliente",
            tags: ["Missions"],
            params: {
                type: "object",
                properties: {
                    customer_id: { type: "string", description: "ID do cliente" }
                },
                required: ["customer_id"]
            },
            response: {
                200: {
                    description: "Missões geradas com sucesso",
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "string", description: "ID da missão" },
                            descricao: { type: "string", description: "Descrição da missão" },
                            concluido: { type: "boolean", description: "Status de conclusão" },
                            createdAt: { type: "string", format: "date-time", description: "Data de criação" },
                            customerId: { type: "string", description: "ID do cliente" },
                            timer: {
                                type: ["integer", "null"],
                                description: "Tempo limite para a missão em segundos"
                            },
                            imageUrl: {
                                type: ["string", "null"],
                                description: "URL da imagem da missão"
                            }
                        }
                    },
                    example: [
                        {
                            id: "mission123",
                            descricao: "Missão de teste",
                            concluido: false,
                            createdAt: "2024-10-28T10:00:00Z",
                            customerId: "cust123",
                            timer: 3600,
                            imageUrl: "https://example.com/mission-image.jpg"
                        },
                        {
                            id: "mission124",
                            descricao: "Segunda missão",
                            concluido: true,
                            createdAt: "2024-10-28T12:00:00Z",
                            customerId: "cust123",
                            timer: null,
                            imageUrl: null
                        }
                    ]
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
    }, GenerateMissionsInDateController);
}
