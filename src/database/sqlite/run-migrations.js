import { sqliteConnection } from "./index.js";
import { createUsers } from "./migrations/create-users.js";

export async function runMigrations() {
  const schemas = [
    createUsers,
  ].join('');

  sqliteConnection()
    .then(database => database.exec(schemas))
    .catch(error => console.error(error))
}
