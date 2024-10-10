import { FastifyInstance } from "fastify";
import { GetProductByIdController } from "../controller/product/get-product-by-id.controller";
import { ListProductByCategoryController } from "../controller/product/list-product-by-category.controller";
import { ListProductByStoreIdController } from "../controller/product/list-product-by-store-id.controller";
import { RegisterProductController } from "../controller/product/register-product.controller";
import { UpdateProductController } from "../controller/product/update-product.controller";
import { DeleteProductByIdController } from "../controller/product/delete-product-by-id.controller";
import { ListAllProductByCategoryRandomController } from "../controller/product/list-by-random-category-product.controller";
import { ListProductByRandomStoreController } from "../controller/product/list-product-by-store-random.controller";


export async function ProductRouter(app: FastifyInstance) {
   app.get("/:id", {
      schema: {
         description: 'Obter um produto pelo ID',
         tags: ['Produto'],
         params: {
            type: 'object',
            properties: {
               id: { type: 'string', description: 'ID do produto' }
            },
            required: ['id']
         },
         response: {
            200: {
               description: 'Produto encontrado com sucesso',
               type: 'object',
               properties: {
                  id: { type: 'string', description: 'ID do produto' },
                  title: { type: 'string', description: 'Título do produto' },
                  slug: { type: 'string', description: 'Slug do produto' },
                  imageUrl: { type: 'string', format: 'url', description: 'URL da imagem do produto' },
                  description: { type: 'string', description: 'Descrição do produto' },
                  priceInCents: { type: 'number', description: 'Preço do produto em centavos' },
                  stock: { type: 'number', description: 'Quantidade em estoque' },
                  categoryId: { type: 'string', description: 'ID da categoria do produto' },
                  storeId: { type: 'string', description: 'ID da loja do produto' },
                  isActive: { type: 'boolean', description: 'Status do produto (ativo ou inativo)' },
                  createdAt: { type: 'string', format: 'date-time', description: 'Data de criação do produto' },
                  updatedAt: { type: 'string', format: 'date-time', description: 'Data da última atualização do produto' }
               },
               example: {
                  id: '12345',
                  title: 'Produto Exemplo',
                  slug: 'produto-exemplo',
                  imageUrl: 'https://example.com/produto.jpg',
                  description: 'Este é um produto exemplo',
                  priceInCents: 1500,
                  stock: 20,
                  categoryId: '67890',
                  storeId: '54321',
                  isActive: true,
                  createdAt: '2024-10-06T10:00:00Z',
                  updatedAt: '2024-10-06T12:00:00Z'
               }
            },
            404: {
               description: 'Produto não encontrado',
               type: 'object',
               properties: {
                  message: { type: 'string' }
               },
               example: {
                  message: 'Product not found'
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
   }, GetProductByIdController);
   app.get("/listallbyrandomcategory", {
      schema: {
          description: 'Listar produtos de uma categoria aleatória',
          tags: ['Produto'],
          querystring: {
              type: 'object',
              properties: {
                  page: { type: 'integer', description: 'Número da página para paginação', default: 1 },
                  size: { type: 'integer', description: 'Tamanho da página para paginação', default: 10 }
              }
          },
          response: {
              200: {
                  description: 'Produtos listados com sucesso de uma categoria aleatória',
                  type: 'object',
                  properties: {
                      category: {
                          type: 'object',
                          properties: {
                              id: { type: 'string', description: 'ID da categoria' },
                              title: { type: 'string', description: 'Título da categoria' },
                              slug: { type: 'string', description: 'Slug da categoria' }
                          }
                      },
                      products: {
                          type: 'array',
                          items: {
                              type: 'object',
                              properties: {
                                  id: { type: 'string', description: 'ID do produto' },
                                  title: { type: 'string', description: 'Título do produto' },
                                  slug: { type: 'string', description: 'Slug do produto' },
                                  imageUrl: { type: 'string', format: 'url', description: 'URL da imagem do produto' },
                                  description: { type: 'string', description: 'Descrição do produto' },
                                  priceInCents: { type: 'number', description: 'Preço do produto em centavos' },
                                  stock: { type: 'number', description: 'Quantidade em estoque' },
                                  categoryId: { type: 'string', description: 'ID da categoria do produto' },
                                  storeId: { type: 'string', description: 'ID da loja do produto' },
                                  isActive: { type: 'boolean', description: 'Status do produto (ativo ou inativo)' },
                                  createdAt: { type: 'string', format: 'date-time', description: 'Data de criação do produto' },
                                  updatedAt: { type: 'string', format: 'date-time', description: 'Data da última atualização do produto' }
                              }
                          }
                      },
                      totalPages: { type: 'number', description: 'Total de páginas disponíveis' },
                      currentPage: { type: 'number', description: 'Número da página atual' }
                  },
                  example: {
                      category: {
                          id: '67890',
                          title: 'Categoria Exemplo',
                          slug: 'categoria-exemplo'
                      },
                      products: [
                          {
                              id: '12345',
                              title: 'Produto Exemplo',
                              slug: 'produto-exemplo',
                              imageUrl: 'https://example.com/produto.jpg',
                              description: 'Este é um produto exemplo',
                              priceInCents: 1500,
                              stock: 20,
                              categoryId: '67890',
                              storeId: '54321',
                              isActive: true,
                              createdAt: '2024-10-06T10:00:00Z',
                              updatedAt: '2024-10-06T12:00:00Z'
                          }
                      ],
                      totalPages: 5,
                      currentPage: 1
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
  }, ListAllProductByCategoryRandomController);
  app.get("/listbyrandomstore", {
   schema: {
       description: 'Listar produtos de uma loja aleatória',
       tags: ['Produto'],
       querystring: {
           type: 'object',
           properties: {
               page: { type: 'integer', description: 'Número da página para paginação', default: 1 },
               size: { type: 'integer', description: 'Tamanho da página para paginação', default: 10 }
           }
       },
       response: {
           200: {
               description: 'Produtos listados com sucesso de uma loja aleatória',
               type: 'object',
               properties: {
                   store: {
                       type: 'object',
                       properties: {
                           id: { type: 'string', description: 'ID da loja' },
                           imageUrl: { type: 'string', format: 'url', description: 'URL da imagem da loja' },
                           title: { type: 'string', description: 'Título da loja' },
                           description: { type: 'string', description: 'Descrição da loja' },
                           cnpj: { type: 'string', description: 'CNPJ da loja' },
                           userId: { type: 'string', description: 'ID do usuário dono da loja' },
                           isActive: { type: 'boolean', description: 'Status da loja (ativa ou inativa)' },
                           createdAt: { type: 'string', format: 'date-time', description: 'Data de criação da loja' },
                           updatedAt: { type: 'string', format: 'date-time', description: 'Data da última atualização da loja' }
                       }
                   },
                   products: {
                       type: 'array',
                       items: {
                           type: 'object',
                           properties: {
                               id: { type: 'string', description: 'ID do produto' },
                               title: { type: 'string', description: 'Título do produto' },
                               slug: { type: 'string', description: 'Slug do produto' },
                               imageUrl: { type: 'string', format: 'url', description: 'URL da imagem do produto' },
                               description: { type: 'string', description: 'Descrição do produto' },
                               priceInCents: { type: 'number', description: 'Preço do produto em centavos' },
                               stock: { type: 'number', description: 'Quantidade em estoque' },
                               storeId: { type: 'string', description: 'ID da loja do produto' },
                               isActive: { type: 'boolean', description: 'Status do produto (ativo ou inativo)' },
                               createdAt: { type: 'string', format: 'date-time', description: 'Data de criação do produto' },
                               updatedAt: { type: 'string', format: 'date-time', description: 'Data da última atualização do produto' }
                           }
                       }
                   },
                   totalPages: { type: 'number', description: 'Total de páginas disponíveis' },
                   currentPage: { type: 'number', description: 'Número da página atual' }
               },
               example: {
                   store: {
                       id: '67890',
                       imageUrl: 'https://example.com/store.jpg',
                       title: 'Loja Exemplo',
                       description: 'Esta é uma loja exemplo',
                       cnpj: '12.345.678/0001-99',
                       userId: '123456',
                       isActive: true,
                       createdAt: '2024-10-06T10:00:00Z',
                       updatedAt: '2024-10-06T12:00:00Z'
                   },
                   products: [
                       {
                           id: '12345',
                           title: 'Produto Exemplo',
                           slug: 'produto-exemplo',
                           imageUrl: 'https://example.com/produto.jpg',
                           description: 'Este é um produto exemplo',
                           priceInCents: 1500,
                           stock: 20,
                           storeId: '67890',
                           isActive: true,
                           createdAt: '2024-10-06T10:00:00Z',
                           updatedAt: '2024-10-06T12:00:00Z'
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
}, ListProductByRandomStoreController);

   app.get("/listbycategory", {
      schema: {
         description: 'Listar produtos por categoria',
         tags: ['Produto'],
         querystring: {
            type: 'object',
            properties: {
               category_id: { type: 'string', description: 'ID da categoria' },
               page: { type: 'integer', description: 'Número da página para paginação', default: 1 },
               size: { type: 'integer', description: 'Tamanho da página para paginação', default: 10 }
            },
            required: ['category_id']
         },
         response: {
            200: {
               description: 'Produtos listados com sucesso',
               type: 'object',
               properties: {
                  products: {
                     type: 'array',
                     items: {
                        type: 'object',
                        properties: {
                           id: { type: 'string', description: 'ID do produto' },
                           title: { type: 'string', description: 'Título do produto' },
                           slug: { type: 'string', description: 'Slug do produto' },
                           imageUrl: { type: 'string', format: 'url', description: 'URL da imagem do produto' },
                           description: { type: 'string', description: 'Descrição do produto' },
                           priceInCents: { type: 'number', description: 'Preço do produto em centavos' },
                           stock: { type: 'number', description: 'Quantidade em estoque' },
                           categoryId: { type: 'string', description: 'ID da categoria do produto' },
                           storeId: { type: 'string', description: 'ID da loja do produto' },
                           isActive: { type: 'boolean', description: 'Status do produto (ativo ou inativo)' },
                           createdAt: { type: 'string', format: 'date-time', description: 'Data de criação do produto' },
                           updatedAt: { type: 'string', format: 'date-time', description: 'Data da última atualização do produto' }
                        }
                     }
                  },
                  totalPages: { type: 'number', description: 'Total de páginas disponíveis' },
                  currentPage: { type: 'number', description: 'Número da página atual' }
               },
               example: {
                  products: [
                     {
                        id: '12345',
                        title: 'Produto Exemplo',
                        slug: 'produto-exemplo',
                        imageUrl: 'https://example.com/produto.jpg',
                        description: 'Este é um produto exemplo',
                        priceInCents: 1500,
                        stock: 20,
                        categoryId: '67890',
                        storeId: '54321',
                        isActive: true,
                        createdAt: '2024-10-06T10:00:00Z',
                        updatedAt: '2024-10-06T12:00:00Z'
                     }
                  ],
                  totalPages: 5,
                  currentPage: 1
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
   }, ListProductByCategoryController);
   app.get("/listbystore", {
      schema: {
         description: 'Listar produtos por loja',
         tags: ['Produto'],
         querystring: {
            type: 'object',
            properties: {
               store_id: { type: 'string', description: 'ID da loja' },
               page: { type: 'integer', description: 'Número da página para paginação', default: 1 },
               size: { type: 'integer', description: 'Tamanho da página para paginação', default: 10 }
            },
            required: ['store_id']
         },
         response: {
            200: {
               description: 'Produtos listados com sucesso',
               type: 'object',
               properties: {
                  products: {
                     type: 'array',
                     items: {
                        type: 'object',
                        properties: {
                           id: { type: 'string', description: 'ID do produto' },
                           title: { type: 'string', description: 'Título do produto' },
                           slug: { type: 'string', description: 'Slug do produto' },
                           imageUrl: { type: 'string', format: 'url', description: 'URL da imagem do produto' },
                           description: { type: 'string', description: 'Descrição do produto' },
                           priceInCents: { type: 'number', description: 'Preço do produto em centavos' },
                           stock: { type: 'number', description: 'Quantidade em estoque' },
                           categoryId: { type: 'string', description: 'ID da categoria do produto' },
                           storeId: { type: 'string', description: 'ID da loja do produto' },
                           isActive: { type: 'boolean', description: 'Status do produto (ativo ou inativo)' },
                           createdAt: { type: 'string', format: 'date-time', description: 'Data de criação do produto' },
                           updatedAt: { type: 'string', format: 'date-time', description: 'Data da última atualização do produto' }
                        }
                     }
                  },
                  totalPages: { type: 'number', description: 'Total de páginas disponíveis' },
                  currentPage: { type: 'number', description: 'Número da página atual' }
               },
               example: {
                  products: [
                     {
                        id: '12345',
                        title: 'Produto Exemplo',
                        slug: 'produto-exemplo',
                        imageUrl: 'https://example.com/produto.jpg',
                        description: 'Este é um produto exemplo',
                        priceInCents: 1500,
                        stock: 20,
                        categoryId: '67890',
                        storeId: '54321',
                        isActive: true,
                        createdAt: '2024-10-06T10:00:00Z',
                        updatedAt: '2024-10-06T12:00:00Z'
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
   }, ListProductByStoreIdController);


   app.post("/", {
      schema: {
         description: 'Registrar um novo produto',
         tags: ['Produto'],
         body: {
            type: 'object',
            properties: {
               title: { type: 'string', description: 'Título do produto' },
               image_url: { type: 'string', format: 'url', description: 'URL da imagem do produto' },
               description: { type: 'string', description: 'Descrição do produto' },
               price_in_cents: { type: 'integer', description: 'Preço do produto em centavos' },
               stock: { type: 'integer', description: 'Quantidade em estoque' },
               category_id: { type: 'string', description: 'ID da categoria do produto' },
               store_id: { type: 'string', description: 'ID da loja do produto' }
            },
            required: ['title', 'image_url', 'description', 'price_in_cents', 'stock', 'category_id', 'store_id']
         },
         response: {
            201: {
               description: 'Produto registrado com sucesso',
               type: 'object',
               properties: {
                  id: { type: 'string', description: 'ID do produto' },
                  title: { type: 'string', description: 'Título do produto' },
                  slug: { type: 'string', description: 'Slug do produto' },
                  imageUrl: { type: 'string', format: 'url', description: 'URL da imagem do produto' },
                  description: { type: 'string', description: 'Descrição do produto' },
                  priceInCents: { type: 'number', description: 'Preço do produto em centavos' },
                  stock: { type: 'number', description: 'Quantidade em estoque' },
                  categoryId: { type: 'string', description: 'ID da categoria do produto' },
                  storeId: { type: 'string', description: 'ID da loja do produto' },
                  isActive: { type: 'boolean', description: 'Status do produto (ativo ou inativo)' },
                  createdAt: { type: 'string', format: 'date-time', description: 'Data de criação do produto' },
                  updatedAt: { type: 'string', format: 'date-time', description: 'Data da última atualização do produto' }
               },
               example: {
                  id: '12345',
                  title: 'Produto Exemplo',
                  slug: 'produto-exemplo',
                  imageUrl: 'https://example.com/produto.jpg',
                  description: 'Este é um produto exemplo',
                  priceInCents: 1500,
                  stock: 20,
                  categoryId: '67890',
                  storeId: '54321',
                  isActive: true,
                  createdAt: '2024-10-06T10:00:00Z',
                  updatedAt: '2024-10-06T12:00:00Z'
               }
            },
            404: {
               description: 'Loja ou categoria não encontrada',
               type: 'object',
               properties: {
                  message: { type: 'string' }
               },
               example: {
                  message: 'Store or category not found'
               }
            },
            500: {
               description: 'Erro interno do servidor ou falha ao registrar o produto',
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
   }, RegisterProductController);

   app.put("/", {
      schema: {
         description: 'Atualizar um produto existente',
         tags: ['Produto'],
         body: {
            type: 'object',
            properties: {
               id: { type: 'string', description: 'ID do produto' },
               title: { type: 'string', description: 'Título do produto' },
               description: { type: 'string', description: 'Descrição do produto' },
               image_url: { type: 'string', format: 'url', description: 'URL da imagem do produto' },
               price_in_cents: { type: 'integer', description: 'Preço do produto em centavos' },
               stock: { type: 'integer', description: 'Quantidade em estoque' },
               category_id: { type: 'string', description: 'ID da categoria do produto' }
            },
            required: ['id', 'title', 'description', 'image_url', 'price_in_cents', 'stock', 'category_id']
         },
         response: {
            200: {
               description: 'Produto atualizado com sucesso',
               type: 'object',
               properties: {
                  id: { type: 'string', description: 'ID do produto' },
                  title: { type: 'string', description: 'Título do produto' },
                  slug: { type: 'string', description: 'Slug do produto' },
                  imageUrl: { type: 'string', format: 'url', description: 'URL da imagem do produto' },
                  description: { type: 'string', description: 'Descrição do produto' },
                  priceInCents: { type: 'number', description: 'Preço do produto em centavos' },
                  stock: { type: 'number', description: 'Quantidade em estoque' },
                  categoryId: { type: 'string', description: 'ID da categoria do produto' },
                  storeId: { type: 'string', description: 'ID da loja do produto' },
                  isActive: { type: 'boolean', description: 'Status do produto (ativo ou inativo)' },
                  createdAt: { type: 'string', format: 'date-time', description: 'Data de criação do produto' },
                  updatedAt: { type: 'string', format: 'date-time', description: 'Data da última atualização do produto' }
               },
               example: {
                  id: '12345',
                  title: 'Produto Atualizado',
                  slug: 'produto-atualizado',
                  imageUrl: 'https://example.com/produto-atualizado.jpg',
                  description: 'Este é um produto atualizado',
                  priceInCents: 2000,
                  stock: 15,
                  categoryId: '67890',
                  storeId: '54321',
                  isActive: true,
                  createdAt: '2024-10-06T10:00:00Z',
                  updatedAt: '2024-10-06T12:00:00Z'
               }
            },
            404: {
               description: 'Produto não encontrado',
               type: 'object',
               properties: {
                  message: { type: 'string' }
               },
               example: {
                  message: 'Product not found'
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
   }, UpdateProductController);

   app.delete("/:id", {
      schema: {
          description: 'Deletar um produto pelo ID',
          tags: ['Produto'],
          params: {
              type: 'object',
              properties: {
                  id: { type: 'string', description: 'ID do produto a ser deletado' }
              },
              required: ['id']
          },
          response: {
              204: {
                  description: 'Produto deletado com sucesso',
                  type: 'null'
              },
              404: {
                  description: 'Produto não encontrado',
                  type: 'object',
                  properties: {
                      message: { type: 'string' }
                  },
                  example: {
                      message: 'Product not found'
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
  }, DeleteProductByIdController);
}