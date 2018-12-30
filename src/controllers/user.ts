import { Request, Response } from "express";

import discord from "services/discord";
import { sendError } from "utils/ErrorHandler";

const discordService = discord.instance;

export const createUser = async (req: Request, res: Response) => {
    const ok = isBodyValid(req.body);
    if (!ok) {
        return sendError(res, "Body not valid", 400);
    }

    const { username, discordId } = req.body;
    const result = await discordService.renameMember(username, discordId);
    if (result) {
        return res.json();
    }
    return sendError(res, "Couldn't rename member", 500);
}

function isBodyValid(body) {
    return body && body.username && body.discordId;
}