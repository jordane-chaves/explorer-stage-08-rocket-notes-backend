import { knex } from "../../../database/knex/index.js";

export class CreateNoteController {
  /**
   * @param {import("fastify").FastifyRequest} request
   * @param {import("fastify").FastifyReply} reply
   * @returns {Promise<import("fastify").FastifyReply>}
   */
  async handle(request, reply) {
    const { title, description, tags, links } = request.body;
    const userId = request.user.sub;

    const [noteId] = await knex("notes").insert({
      title,
      description,
      user_id: userId,
    });

    if (links.length > 0) {
      const linksInsert = links.map((link) => ({ note_id: noteId, url: link }));
      await knex("links").insert(linksInsert);
    }

    if (tags.length > 0) {
      const tagsInsert = tags.map((tag) => ({
        note_id: noteId,
        user_id: userId,
        name: tag,
      }));

      await knex("tags").insert(tagsInsert);
    }

    return reply.status(201).send();
  }
}
