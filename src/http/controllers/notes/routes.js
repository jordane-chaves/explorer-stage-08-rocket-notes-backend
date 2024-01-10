import { verifyJWT } from "../../middlewares/verify-jwt.js";
import { CreateNoteController } from "./create-note-controller.js";
import { DeleteNoteController } from "./delete-note-controller.js";
import { FetchNotesController } from "./fetch-notes-controller.js";
import { GetNoteController } from "./get-note-controller.js";

const createNote = new CreateNoteController();
const getNote = new GetNoteController();
const fetchNotes = new FetchNotesController();
const deleteNote = new DeleteNoteController();

/**
 * @param {import("fastify").FastifyInstance} app
 */
export async function notesRoutes(app) {
  app.addHook("onRequest", verifyJWT);

  app.post("/notes", (request, reply) =>
    createNote.handle(request, reply)
  );
  app.get("/notes/:id", (request, reply) => getNote.handle(request, reply));
  app.get("/notes", (request, reply) => fetchNotes.handle(request, reply));
  app.delete("/notes/:id", (request, reply) =>
    deleteNote.handle(request, reply)
  );
}
