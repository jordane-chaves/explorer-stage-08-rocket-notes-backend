import { LocalStorage } from "../../../storage/local-storage.js";
import { knex } from "../../../database/knex/index.js";
import { AppError } from "../../../errors/app-error.js";

export class UploadAvatarController {
  /**
   * @param {import("fastify").FastifyRequest} request
   * @param {import("fastify").FastifyReply} reply
   * @returns
   */
  async handle(request, reply) {
    const userId = request.user.sub;

    const data = await request.file({
      limits: {
        fileSize: 1000 * 1000 * 2, // 2mb
      },
    });

    if (!data) {
      throw new AppError("Send an avatar file.", 400);
    }

    const localStorage = new LocalStorage();

    let body = null

    try {
      body = await data.toBuffer();
    } catch {
      throw new AppError("Avatar file too large.", 413);
    }

    const { url } = await localStorage.upload({
      fileName: data.filename,
      fileType: data.mimetype,
      body,
    });

    const user = await knex("users").where({ id: userId }).first();

    if (!user) {
      throw new AppError("User not found.");
    }

    if (user.avatar) {
      await localStorage.delete({ fileName: user.avatar });
    }

    user.avatar = url;

    await knex("users").where({ id: user.id }).update(user);

    return reply.status(200).send({
      avatar: url,
    });
  }
}
