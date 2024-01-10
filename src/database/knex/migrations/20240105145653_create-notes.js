/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable("notes", (table) => {
    table.increments("id");
    table.text("title").notNullable();
    table.text("description").nullable();
    table
      .integer("user_id")
      .notNullable()
      .references("id")
      .inTable("users");

    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
    table.timestamp("updated_at").defaultTo(knex.fn.now()).nullable();
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTable("notes");
}
