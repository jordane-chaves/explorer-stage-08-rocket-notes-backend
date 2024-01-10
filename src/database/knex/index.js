import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import setupKnex from "knex";

import { env } from "../../env/index.js";

const currentFolder = dirname(fileURLToPath(import.meta.url));
const connectionConfig =
  env.DATABASE_CLIENT === "sqlite3"
    ? {
        filename: env.DATABASE_URL,
      }
    : env.DATABASE_URL;

const poolConfig =
  env.DATABASE_CLIENT === "sqlite3"
    ? {
        afterCreate: (connection, callback) =>
          connection.run("PRAGMA foreign_keys = ON", callback),
      }
    : undefined;

/**
 * @type {import("knex").Knex.Config>}
 */
export const config = {
  client: env.DATABASE_CLIENT,
  connection: connectionConfig,
  useNullAsDefault: true,
  migrations: {
    extension: "js",
    directory: resolve(currentFolder, "migrations"),
  },
  pool: poolConfig,
};

export const knex = setupKnex(config);
