import { app } from "./app";
import { config } from "./env";

// Inicializar o servidor
const start = async () => {
  try {
    await app.listen({ port: config.PORT, host: "0.0.0.0" });
    console.log('Servidor rodando em http://localhost:'+config.PORT);
  } catch (err) {
    app.log.error(err as Error);
    process.exit(1);
  }
};
start();
