import fastify from "fastify";

import cors from '@fastify/cors'
import { StoreRouter } from "./http/router/store-router";
import { ProductRouter } from "./http/router/product-router";
import { CategoryRouter } from "./http/router/category-router";
import { OrderRouter } from "./http/router/order-router";



export const app = fastify({
    logger: true
});
app.register(cors, {
    origin: '*',
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
})

app.register(StoreRouter, { prefix: "/store" })

app.register(ProductRouter,{prefix:"/product"})

app.register(CategoryRouter,{prefix:"/category"})

app.register(OrderRouter,{prefix:"/orders"})