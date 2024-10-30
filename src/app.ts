import fastify from "fastify";

import cors from '@fastify/cors';
import { StoreRouter } from "./http/router/store-router";
import { ProductRouter } from "./http/router/product-router";
import { CategoryRouter } from "./http/router/category-router";
import { OrderRouter } from "./http/router/order-router";
import { ProductInOrdersRouter } from "./http/router/product-in-orders-router";
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { config } from "./env";
import { PetsRouter } from "./http/router/pets-router";
import { MissionRouter } from "./http/router/mission-router";

export const app = fastify({ logger: true });

// Registrar o CORS
app.register(cors, {
  origin: '*',
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
// Definir a URL do servidor dinamicamente
const serverUrl = config.SERVER_URL || 'http://localhost:3000';
// Registrar o Swagger para fornecer os esquemas
app.register(swagger, {
  openapi: {
    info: {
      title: 'API de Produtos',
      description: 'Documentação da API de Produtos',
      version: '1.0.0',
    },
    servers: [
      {
        url: serverUrl,
        description: 'Servidor local',
      }
    ],
  },
});

// Registrar o Swagger-UI para fornecer a interface gráfica
app.register(swaggerUi, {
  routePrefix: '/docs', // Prefixo da rota para acessar a interface do Swagger
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false,
  },
  staticCSP: true,
  transformStaticCSP: (header: string) => header,
});
// Definir rota principal
app.get("/", async function helloWorld(req, res) {
  return res.status(200).send("Hello World");
});

// Registrar as rotas da aplicação
app.register(ProductInOrdersRouter, { prefix: "/product-in-orders" });
app.register(StoreRouter, { prefix: "/store" });
app.register(ProductRouter, { prefix: "/product" });
app.register(CategoryRouter, { prefix: "/category" });
app.register(OrderRouter, { prefix: "/orders" });
app.register(PetsRouter,{prefix:"/pets"});

app.register(MissionRouter,{prefix:"/missions"})