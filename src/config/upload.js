import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const currentFolder = dirname(fileURLToPath(import.meta.url));

const tmpFolder = resolve(currentFolder, '..', '..', 'tmp');
const uploadsFolder = resolve(tmpFolder, 'uploads');

export default {
  tmpFolder,
  uploadsFolder,
}
