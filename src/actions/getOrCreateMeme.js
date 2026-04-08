import * as path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import { getToday } from '../utils/getToday.js';
import { logInfo } from '../utils/logger.js';
import { getBaseUrl } from '../utils/getBaseUrl.js';
import { loadMemes } from '../utils/getMemeDir.js';

/**
 * Генерировать мем для пользователя
 * @param service
 * @param userId
 * @return {*}
 */
function generateMeme(service, userId) {
    const memes = loadMemes();
    const seed = service + userId + getToday();
    const hash = crypto.createHash('md5').update(seed).digest('hex');
    const num = parseInt(hash.substring(0, 8), 16);
    return memes[num % memes.length];
}

/**
 * Получить файл пользователя
 * @param service
 * @param userId
 * @return {*}
 */
function getUserFile(service, userId) {
    return path.join(path.join(process.cwd(), 'remember'), `mem_${service}_${userId}.json`);
}

/**
 * Получить мем дня для пользователя
 * @param service
 * @param userId
 * @return {*}
 */
export function getOrCreateMeme(service, userId) {
    const filePath = getUserFile(service, userId);
    const today = getToday();

    if (fs.existsSync(filePath)) {
        try {
            const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
            if (data.date === today && data.meme) {
                return data.meme;
            }
        } catch (e) {
            logInfo(`битый JSON, пересоздаём для ${service}:${userId}`);
        }
    }

    // создаём новый
    const meme = generateMeme(service, userId);

    // убедимся, что директория существует
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify({
        date: today,
        meme: meme
    }, null, 2));

    return getBaseUrl() + meme;
}