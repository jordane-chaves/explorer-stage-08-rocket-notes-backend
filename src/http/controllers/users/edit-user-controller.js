import bcryptjs from "bcryptjs";

import { knex } from "../../../database/knex/index.js";
import { AppError } from "../../../errors/app-error.js";

export class EditUserController {
  /**
   * @param {import("fastify").FastifyRequest} request
   * @param {import("fastify").FastifyReply} reply
   * @returns
   */
  async handle(request, reply) {
    const { name, email, password, old_password: oldPassword } = request.body;
    const userId = request.user.sub;

    if (password && !oldPassword) {
      throw new AppError("The old password is required.");
    }

    const user = await knex("users").where({ id: userId }).first();

    if (!user) {
      throw new AppError(`User not found.`);
    }

    const userWithSameEmail = await knex("users")
      .where({ email })
      .first();

    const isSameUser =
      userWithSameEmail && userWithSameEmail.id === user.id;

    if (!isSameUser) {
      throw new AppError(`User ${email} already exists.`, 409);
    }

    if (password && oldPassword) {
      const isOldPasswordValid = await bcryptjs.compare(
        oldPassword,
        user.password
      );

      if (!isOldPasswordValid) {
        throw new AppError("The old password is incorrect.", 405);
      }

      user.password = await bcryptjs.hash(password, 8);
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    await knex("users")
      .where({ id: userId })
      .update(user)

    return reply.status(204).send();
  }
}
