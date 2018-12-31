import { Request, Response } from "express";

import Logger from "utils/Logger";

const logger = (req: Request, _: Response, next) => {
    Logger.log(`${req.method.toUpperCase()} ${req.originalUrl}`, req.body);
    next();
}

export default logger;