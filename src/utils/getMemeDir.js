import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getMemeDir() {
    return path.join(__dirname, '..', '..', 'memes')
}

/**
 * Получить все картинки из папки
 * @return {*}
 */
export function loadMemes() {
    return fs.readdirSync(getMemeDir())
        .filter(f => /\.(jpg|jpeg|png|gif)$/i.test(f))
        .map(f => `/memes/${f}`);
}