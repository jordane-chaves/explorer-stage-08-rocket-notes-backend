/**
 * @param {import("fastify").FastifyRequest} request
 * @param {import("fastify").FastifyReply} reply
 * @returns
 */
export async function verifyJWT(request, reply) {
  try {
    await request.jwtVerify();
  } catch {
    return reply.status(401).send({
      statusCode: 401,
      message: 'Unauthorized',
    })
  }
}
