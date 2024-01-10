import { verifyJWT } from "../../middlewares/verify-jwt.js";
import { AuthenticateUserController } from "./authenticate-user-controller.js";
import { EditUserController } from "./edit-user-controller.js";
import { RegisterUserController } from "./register-user-controller.js";
import { UploadAvatarController } from "./upload-avatar-controller.js";

const authenticateUser = new AuthenticateUserController();
const registerUser = new RegisterUserController();
const editUser = new EditUserController();
const uploadAvatar = new UploadAvatarController();

/**
 * @param {import("fastify").FastifyInstance} app
 */
export async function usersRoutes(app) {
  app.post("/sessions", (request, reply) =>
    authenticateUser.handle(request, reply)
  );

  app.post("/users", (request, reply) => registerUser.handle(request, reply));

  /* Authenticated */
  app.put("/users", { onRequest: [verifyJWT] }, (request, reply) =>
    editUser.handle(request, reply)
  );

  app.patch("/avatar", { onRequest: [verifyJWT] }, (request, reply) =>
    uploadAvatar.handle(request, reply)
  );
}
