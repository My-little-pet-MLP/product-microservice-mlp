import { FastifyInstance } from "fastify";
import { GetStoreByIdController } from "../controller/store/get-store-by-id.controller";
import { GetStoreByUserIdController } from "../controller/store/get-store-by-user-id.controller";
import { RegisterStoreController } from "../controller/store/register-store.controller";
import { UpdateStoreController } from "../controller/store/update-store.controller";
import { DeleteStoreByIdController } from "../controller/store/delete-store-by-id.controller";
import { ReactivateStoreByIdController } from "../controller/store/reactivate-store-by-id.controller";

export async function StoreRouter(app: FastifyInstance) {
    app.get("/:id", {
        schema: {
            description: 'Obter uma loja pelo ID',
            tags: ['Loja'],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'ID da loja' },
                },
                required: ['id']
            },
            response: {
                200: {
                    description: 'Loja encontrada com sucesso',
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        imageUrl: { type: 'string' },
                        title: { type: 'string' },
                        description: { type: 'string' },
                        cnpj: { type: 'string' },
                        userId: { type: 'string' },
                        isActive: { type: 'boolean' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                    example: {
                        id: '12345',
                        imageUrl: 'https://example.com/store-image.jpg',
                        title: 'Loja Exemplo',
                        description: 'Uma loja de exemplo para testes',
                        cnpj: '00.000.000/0001-00',
                        userId: '67890',
                        isActive: true,
                        createdAt: '2024-10-06T10:00:00Z',
                        updatedAt: '2024-10-06T10:00:00Z',
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
                }
            }
        }
    }, GetStoreByIdController)

    app.get("/getbyuser/:user_id", {
        schema: {
            description: 'Obter uma loja pelo ID do usuário',
            tags: ['Loja'],
            params: {
                type: 'object',
                properties: {
                    user_id: { type: 'string', description: 'ID do usuário' },
                },
                required: ['user_id']
            },
            response: {
                200: {
                    description: 'Loja encontrada com sucesso',
                    type: 'object',
                    properties: {
                        id: { type: 'string', description: 'ID da loja' },
                        imageUrl: { type: 'string', description: 'URL da imagem da loja' },
                        title: { type: 'string', description: 'Nome da loja' },
                        description: { type: 'string', description: 'Descrição da loja' },
                        cnpj: { type: 'string', description: 'CNPJ da loja' },
                        userId: { type: 'string', description: 'ID do usuário associado' },
                        isActive: { type: 'boolean', description: 'Se a loja está ativa' },
                        createdAt: { type: 'string', format: 'date-time', description: 'Data de criação' },
                        updatedAt: { type: 'string', format: 'date-time', description: 'Data da última atualização' },
                    },
                    example: {
                        id: '12345',
                        imageUrl: 'https://example.com/store-image.jpg',
                        title: 'Loja Exemplo',
                        description: 'Uma loja de exemplo para testes',
                        cnpj: '00.000.000/0001-00',
                        userId: '67890',
                        isActive: true,
                        createdAt: '2024-10-06T10:00:00Z',
                        updatedAt: '2024-10-06T10:00:00Z',
                    }
                },
                404: {
                    description: 'Loja não encontrada para o ID do usuário fornecido',
                    type: 'object',
                    properties: {
                        message: { type: 'string', description: 'Mensagem de erro' }
                    },
                    example: {
                        message: 'There is no store registered with this user ID'
                    }
                },
                500: {
                    description: 'Erro interno do servidor',
                    type: 'object',
                    properties: {
                        message: { type: 'string', description: 'Mensagem de erro' }
                    },
                    example: {
                        message: 'Internal Server Error: Unexpected error occurred'
                    }
                }
            }
        }
    }, GetStoreByUserIdController);

    app.post("/", {
        schema: {
            description: 'Registrar uma nova loja',
            tags: ['Loja'],
            body: {
                type: 'object',
                properties: {
                    title: { type: 'string', description: 'Nome da loja' },
                    description: { type: 'string', description: 'Descrição da loja' },
                    cnpj: { type: 'string', description: 'CNPJ da loja' },
                    image_url: { type: 'string', format: 'url', description: 'URL da imagem da loja' },
                    user_id: { type: 'string', description: 'ID do usuário que está registrando a loja' }
                },
                required: ['title', 'description', 'cnpj', 'user_id', 'image_url']
            },
            response: {
                200: {
                    description: 'Loja registrada com sucesso',
                    type: 'object',
                    properties: {
                        id: { type: 'string', description: 'ID da loja registrada' },
                        title: { type: 'string', description: 'Nome da loja' },
                        description: { type: 'string', description: 'Descrição da loja' },
                        cnpj: { type: 'string', description: 'CNPJ da loja' },
                        createdAt: { type: 'string', format: 'date-time', description: 'Data de criação' },
                        image_url: { type: 'string', description: 'URL da imagem da loja' }
                    }
                },
                404: {
                    description: 'Usuário não encontrado',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                },
                500: {
                    description: 'Erro interno do servidor',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                }
            }
        }
    }, RegisterStoreController);

    app.put("/", {
        schema: {
            description: 'Atualizar os dados de uma loja',
            tags: ['Loja'],
            body: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'ID da loja' },
                    title: { type: 'string', description: 'Nome da loja' },
                    description: { type: 'string', description: 'Descrição da loja' },
                    cnpj: { type: 'string', description: 'CNPJ da loja' },
                    image_url: { type: 'string', format: 'url', description: 'URL da imagem da loja' },
                },
                required: ['id', 'title', 'description', 'cnpj', 'image_url']
            },
            response: {
                200: {
                    description: 'Loja atualizada com sucesso',
                    type: 'object',
                    properties: {
                        id: { type: 'string', description: 'ID da loja' },
                        imageUrl: { type: 'string', description: 'URL da imagem da loja' },
                        title: { type: 'string', description: 'Nome da loja' },
                        description: { type: 'string', description: 'Descrição da loja' },
                        cnpj: { type: 'string', description: 'CNPJ da loja' },
                        userId: { type: 'string', description: 'ID do usuário associado' },
                        isActive: { type: 'boolean', description: 'Status da loja (ativa ou inativa)' },
                        createdAt: { type: 'string', format: 'date-time', description: 'Data de criação da loja' },
                        updatedAt: { type: 'string', format: 'date-time', description: 'Data de atualização da loja' }
                    }
                },
                404: {
                    description: 'Loja não encontrada',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                },
                500: {
                    description: 'Erro interno do servidor',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                }
            }
        }
    }, UpdateStoreController);

    app.delete("/:id", {
        schema: {
            description: 'Deletar uma loja pelo ID',
            tags: ['Loja'],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'ID da loja a ser deletada' }
                },
                required: ['id']
            },
            response: {
                204: {
                    description: 'Loja deletada com sucesso',
                    type: 'null'
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
    }, DeleteStoreByIdController);
    app.put("/reactivate/:id", {
        schema: {
            description: 'Reativar uma loja pelo ID',
            tags: ['Loja'],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'ID da loja a ser reativada' }
                },
                required: ['id']
            },
            response: {
                200: {
                    description: 'Loja reativada com sucesso',
                    type: 'object',
                    properties: {
                        id: { type: 'string', description: 'ID da loja' },
                        imageUrl: { type: 'string', description: 'URL da imagem da loja' },
                        title: { type: 'string', description: 'Nome da loja' },
                        description: { type: 'string', description: 'Descrição da loja' },
                        cnpj: { type: 'string', description: 'CNPJ da loja' },
                        userId: { type: 'string', description: 'ID do usuário associado' },
                        isActive: { type: 'boolean', description: 'Status da loja (ativa ou inativa)' },
                        createdAt: { type: 'string', format: 'date-time', description: 'Data de criação da loja' },
                        updatedAt: { type: 'string', format: 'date-time', description: 'Data de atualização da loja' }
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
    }, ReactivateStoreByIdController)
}