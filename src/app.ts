import fastify from "fastify";

import cors from '@fastify/cors'



export const app = fastify({
    logger:true
});
app.register(cors, { 
    origin: '*',
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS','PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
