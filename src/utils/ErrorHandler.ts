import { Response } from "express";
import Logger from "./Logger";

export const sendError = (res: Response, message: string, code: number) => {
    Logger.error(message);
    res.status(code);
    return res.json({
        error: message,
    });
}