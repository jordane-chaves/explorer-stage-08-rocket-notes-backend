import { resolve } from "node:path";
import { open } from "sqlite";
import sqlite3 from "sqlite3";

import { env } from "../../env/index.js";

export async function sqliteConnection() {
  const filename = resolve(env.DATABASE_URL);

  return open({
    driver: sqlite3.Database,
    filename,
  });
}
