import fastify from "fastify";
import { StoreRouter } from "./controller/store/store-router";
import cors from '@fastify/cors'


export const app = fastify({
    logger:true
});
app.register(cors, { 
    origin: '*',
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS','PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
app.register(StoreRouter ,{ prefix: '/api/store' })