import { getOrCreateMeme } from '../actions/getOrCreateMeme.js';
import {loadMemes} from "../utils/getMemeDir.js";

function response(res, text, attachments = []) {
    const resp = {
        response_type: "ephemeral",
        text: text,
    }

    if(attachments.length > 0) {
        resp.attachments = attachments;
    }

    return res.json(resp)
}


export function getMem(req, res) {
    const userId = req.body.user_id || 'anon';

    if (loadMemes().length === 0) {
        return response(res,'Нет мемов 😢');
    }

    const memePath = getOrCreateMeme('mm', userId);

    return response(
        res,
        '',
        [{ image_url: memePath }
        ]
    )
}