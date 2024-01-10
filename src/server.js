import { runMigrations } from "./database/knex/run-migrations.js";
import { env } from "./env/index.js";
import { app } from "./app.js";

async function bootstrap() {
  await runMigrations();

  await app.listen({ port: env.PORT });

  console.log(`⚡ HTTP server running`);
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
