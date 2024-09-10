import { app } from "./app";
import { config } from "./env";


const start = async () => {
    try {
      await app.listen({ port: config.PORT });
    } catch (err) {
        app.log.error(err);
      process.exit(1);
    }
  };
start();