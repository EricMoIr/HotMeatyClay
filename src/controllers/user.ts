import { Request, Response } from "express";

import discord from "services/discord";
import { sendError } from "utils/ErrorHandler";

const discordService = discord.instance;

function validateRequest(res: Response, predicate: (...any) => boolean, ...args) {
    if (!predicate(...args)) {
        return sendError(res, "Request not valid. Read the docs. I wrote them for you, nab.", 400);
    }
    return true;
}

export const createUser = async (req: Request, res: Response) => {
    function isRequestValid(body) {
        return body && body.username && body.discordId;
    }

    if (!validateRequest(res, isRequestValid, req.body)) {
        return;
    }

    const { username, isBanned, discordId } = req.body;
    const error = await handleUser(username, discordId, isBanned);
    if (error) {
        return sendError(res, error, 500);
    }
    return res.json();
}

export const updateUser = async (req: Request, res: Response) => {
    function isRequestValid(body, params) {
        return body && body.username && params.id;
    }

    if (!validateRequest(res, isRequestValid, req.body, req.params)) {
        return;
    }

    const { username, isBanned } = req.body;
    const { id } = req.params;
    const error = await handleUser(username, id, isBanned);
    if (error) {
        return sendError(res, error, 500);
    }
    return res.json();
}

async function handleUser(username: string, discordId: string, isBanned?: boolean) {
    let result = await discordService.renameMember(username, discordId);
    if (!result) {
        return "Couldn't rename member. The bot is probably missing permissions.";
    }
    if (isBanned) {
        result = await discordService.handleBannedUser(discordId);
        if (!result) {
            return "Couldn't handle banned user. The bot is probably missing permissions.";
        }
    }
    return null;
}