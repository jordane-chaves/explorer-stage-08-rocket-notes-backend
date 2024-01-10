import { knex } from "./index.js";

export async function runMigrations() {
  await knex.migrate.latest();
}
