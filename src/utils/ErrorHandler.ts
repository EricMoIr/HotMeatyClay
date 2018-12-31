import { Response } from "express";
import Logger from "./Logger";

export const sendError = (res: Response, message: string, code: number) => {
    Logger.error(message);
    res.status(code);
    res.json({
        error: message,
    });
    return false;
}