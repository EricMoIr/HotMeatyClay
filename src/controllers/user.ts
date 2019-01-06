import { Request, Response } from "express";

import DiscordService from "services/DiscordService";
import { sendError } from "utils/ErrorHandler";

const discordService = DiscordService.instance;

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
    const error = await discordService.handleUser(username, discordId, isBanned);
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
    const error = await discordService.handleUser(username, id, isBanned);
    if (error) {
        return sendError(res, error, 500);
    }
    return res.json();
}