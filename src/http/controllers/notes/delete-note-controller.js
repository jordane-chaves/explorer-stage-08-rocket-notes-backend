import { knex } from "../../../database/knex/index.js";

export class DeleteNoteController {
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

    await knex("notes").where({ id }).delete();

    return reply.status(204).send();
  }
}
