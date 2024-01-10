import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import uploadConfig from "../config/upload.js";

export class LocalStorage {
  /**
   * @param {Object} params
   * @param {string} params.fileName
   * @param {string} params.fileType
   * @param {Buffer} params.body
   */
  async upload({ fileName, body }) {
    const uploadId = randomUUID();
    const uniqueFileName = `${uploadId}-${fileName}`;

    await fs.promises.writeFile(
      path.resolve(uploadConfig.uploadsFolder, uniqueFileName),
      body,
    );

    return { url: uniqueFileName };
  }

  /**
   * @param {Object} params
   * @param {string} params.fileName
   */
  async delete({ fileName }) {
    const filePath = path.resolve(uploadConfig.uploadsFolder, fileName);

    try {
      await fs.promises.stat(filePath);
    } catch {
      return;
    }

    await fs.promises.unlink(filePath);
  }
}
