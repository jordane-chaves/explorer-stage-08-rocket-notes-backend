import { knex } from "../../../database/knex/index.js";

export class FetchNotesController {
  /**
   * @param {import("fastify").FastifyRequest} request
   * @param {import("fastify").FastifyReply} reply
   * @returns {Promise<import("fastify").FastifyReply>}
   */
  async handle(request, reply) {
    const { title = '', tags } = request.query;
    const userId = request.user.sub;

    let notes;

    if (tags) {
      const filterTags = tags.split(",").map((tag) => tag.trim());

      notes = await knex("notes")
        .select([
          "notes.id",
          "notes.title",
          "notes.user_id",
        ])
        .innerJoin("tags", "tags.note_id", "notes.id")
        .where("tags.user_id", userId)
        .whereLike("notes.title", `%${title}%`)
        .whereIn("tags.name", filterTags)
        .groupBy("notes.id")
        .orderBy("notes.title")
    } else {
      notes = await knex("notes")
        .where({ user_id: userId })
        .whereLike("title", `%${title}%`)
        .orderBy("title");
    }

    const userTags = await knex("tags").where({ user_id: userId });
    const notesWithTags = notes.map(note => {
      const noteTags = userTags.filter(tag => tag.note_id === note.id);

      return {
        ...note,
        tags: noteTags,
      }
    })

    return reply.status(200).send({
      notes: notesWithTags,
    });
  }
}
