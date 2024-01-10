import fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import fastifyMultipart from "@fastify/multipart";
import fastifyCors from "@fastify/cors";
import fastifyStatic from "@fastify/static";

import { notesRoutes } from "./http/controllers/notes/routes.js";
import { usersRoutes } from "./http/controllers/users/routes.js";
import { tagsRoutes } from "./http/controllers/tags/routes.js";
import { AppError } from "./errors/app-error.js";
import authConfig from "./config/auth.js";
import uploadConfig from "./config/upload.js";
import { env } from "./env/index.js";

export const app = fastify();

app.register(fastifyCors);

app.register(fastifyStatic, {
  root: uploadConfig.uploadsFolder,
  prefix: '/files/'
});

app.register(fastifyJwt, {
  secret: authConfig.secret,
  sign: {
    expiresIn: authConfig.expiresIn,
  },
});

app.register(fastifyMultipart);

app.register(notesRoutes);
app.register(tagsRoutes);
app.register(usersRoutes);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      status: "error",
      message: error.message,
      statusCode: error.statusCode,
    });
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error);
  } else {
    // TODO: Here we should log to an external tool like DataDog/Newrelic/Sentry
  }

  return reply.status(500).send({
    status: "error",
    message: "Internal server error.",
    statusCode: 500,
  });
});
