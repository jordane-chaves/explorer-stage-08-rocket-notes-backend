import { knex } from "../../../database/knex/index.js";
import { AppError } from "../../../errors/app-error.js";

export class GetNoteController {
  /**
   * @param {import("fastify").FastifyRequest} request
   * @param {import("fastify").FastifyReply} reply
   * @returns {Promise<import("fastify").FastifyReply>}
   */
  async handle(request, reply) {
    const { id } = request.params;
    const userId = request.user.sub;

    const note = await knex("notes").where({ id }).first();

    if (userId !== note.user_id) {
      throw new AppError("Not allowed", 405);
    }

    const tags = await knex("tags").where({ note_id: note.id }).orderBy("name");
    const links = await knex("links")
      .where({ note_id: note.id })
      .orderBy("created_at");

    return reply.status(200).send({
      note: {
        ...note,
        tags,
        links,
      },
    });
  }
}
