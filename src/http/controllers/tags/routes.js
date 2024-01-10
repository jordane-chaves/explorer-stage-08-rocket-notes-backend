import { verifyJWT } from "../../middlewares/verify-jwt.js";
import { FetchTagsController } from "./fetch-tags-controller.js";

const fetchTags = new FetchTagsController();

/**
 * @param {import("fastify").FastifyInstance} app
 */
export async function tagsRoutes(app) {
  app.addHook('onRequest', verifyJWT);

  app.get("/tags", (request, reply) =>
    fetchTags.handle(request, reply)
  );
}
