import bcryptjs from "bcryptjs";

import { knex } from "../../../database/knex/index.js";
import { AppError } from "../../../errors/app-error.js";

export class RegisterUserController {
  /**
   * @param {import("fastify").FastifyRequest} request
   * @param {import("fastify").FastifyReply} reply
   * @returns
   */
  async handle(request, reply) {
    const { name, email, password } = request.body;

    const userAlreadyExists = await knex("users")
      .where({ email })
      .first();

    if (userAlreadyExists) {
      throw new AppError(`User "${email}" already exists.`, 409);
    }

    const hashedPassword = await bcryptjs.hash(password, 8);

    await knex("users").insert({
      name,
      email,
      password: hashedPassword,
    });

    return reply.status(201).send();
  }
}
