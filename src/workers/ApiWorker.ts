import * as express from "express";
import * as bodyParser from "body-parser";

import logger from "middlewares/logger";
import Logger from "utils/Logger";
import * as UserController from "controllers/user";

const { PORT } = process.env;

export function listen() {
    return new Promise((resolve) => {
        const app = express();
        
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(logger);
        
        app.post("/user", UserController.createUser);
        app.put("/user", UserController.updateUser);
        
        app.listen(PORT, () => {
            Logger.log("API started listening");
            resolve();
        })
    })
}