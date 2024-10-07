import { FastifyInstance } from "fastify";
import { GetByIdCategoryController } from "../controller/categories/get-by-id-category.controller";
import { ListAllCategoryController } from "../controller/categories/list-all-category.controller";
import { RegisterCategoryController } from "../controller/categories/register-category.controller";

export async function CategoryRouter(app: FastifyInstance) {
    app.get("/:id", {
        schema: {
            description: 'Obter uma categoria pelo ID',
            tags: ['Categoria'],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'ID da categoria' }
                },
                required: ['id']
            },
            response: {
                200: {
                    description: 'Categoria encontrada com sucesso',
                    type: 'object',
                    properties: {
                        id: { type: 'string', description: 'ID da categoria' },
                        title: { type: 'string', description: 'Título da categoria' },
                        slug: { type: 'string', description: 'Slug da categoria' }
                    },
                    example: {
                        id: '12345',
                        title: 'Categoria Exemplo',
                        slug: 'categoria-exemplo'
                    }
                },
                404: {
                    description: 'Categoria não encontrada',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    },
                    example: {
                        message: 'Category not found'
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
    }, GetByIdCategoryController);
    app.get("/", {
        schema: {
            description: 'Listar todas as categorias',
            tags: ['Categoria'],
            response: {
                200: {
                    description: 'Lista de todas as categorias',
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string', description: 'ID da categoria' },
                            title: { type: 'string', description: 'Título da categoria' },
                            slug: { type: 'string', description: 'Slug da categoria' }
                        }
                    },
                    example: [
                        {
                            id: '12345',
                            title: 'Categoria Exemplo 1',
                            slug: 'categoria-exemplo-1'
                        },
                        {
                            id: '67890',
                            title: 'Categoria Exemplo 2',
                            slug: 'categoria-exemplo-2'
                        }
                    ]
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
    }, ListAllCategoryController);
    app.post("/", {
        schema: {
            description: 'Registrar uma nova categoria',
            tags: ['Categoria'],
            body: {
                type: 'object',
                properties: {
                    title: { type: 'string', description: 'Título da categoria' }
                },
                required: ['title'],
            },
            response: {
                200: {
                    description: 'Categoria registrada com sucesso',
                    type: 'object',
                    properties: {
                        id: { type: 'string', description: 'ID da categoria' },
                        title: { type: 'string', description: 'Título da categoria' },
                        slug: { type: 'string', description: 'Slug da categoria' }
                    },
                    example: {
                        id: '12345',
                        title: 'Nova Categoria',
                        slug: 'nova-categoria'
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
    }, RegisterCategoryController);
}