import { knex } from "../../../database/knex/index.js";

export class FetchTagsController {
  /**
   * @param {import("fastify").FastifyRequest} request
   * @param {import("fastify").FastifyReply} reply
   * @returns {Promise<import("fastify").FastifyReply>}
   */
  async handle(request, reply) {
    const userId = request.user.sub;

    const tags = await knex("tags").where({ user_id: userId }).groupBy("name");

    return reply.status(200).send({
      tags,
    });
  }
}
