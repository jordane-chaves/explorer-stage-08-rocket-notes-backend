import bcryptjs from "bcryptjs";

import { knex } from "../../../database/knex/index.js";
import { AppError } from "../../../errors/app-error.js";

export class AuthenticateUserController {
  /**
   * @param {import("fastify").FastifyRequest} request
   * @param {import("fastify").FastifyReply} reply
   * @returns
   */
  async handle(request, reply) {
    const { email, password } = request.body;

    const user = await knex('users').where({ email }).first();

    if (!user) {
      throw new AppError('Wrong credentials', 401);
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError('Wrong credentials', 401);
    }

    const accessToken = await reply.jwtSign({
      sub: user.id,
    })

    return reply.send({
      access_token: accessToken,
      user: {
        ...user,
        password: undefined,
      },
    })
  }
}
