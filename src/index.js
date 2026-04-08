import express from 'express';
import fs from 'fs';
import { getMemeDir } from './utils/getMemeDir.js'
import { log } from './utils/logger.js';
import { getMem } from './controllers/mattermost.js';

const PORT = process.env.PORT || 3000;

export function initial() {
    const app = express();
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    if (!fs.existsSync(getMemeDir())) {
        fs.mkdirSync(getMemeDir());
    }

    app.use('/memes', express.static(getMemeDir()));

    app.get('/mm/mem', getMem)


    app.listen(PORT, () => {
        log(`Server running on port ${PORT}`);
    });
}