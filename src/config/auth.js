import { env } from "../env/index.js";

export default {
  secret: env.JWT_SECRET,
  expiresIn: '1d',
}
