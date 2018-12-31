import * as express from "express";
import * as bodyParser from "body-parser";

import Logger from "utils/Logger";
import logger from "middlewares/logger";
import * as UserController from "controllers/user";
import discord from "services/discord";

const discordService = discord.instance;
const { PORT } = process.env;

const init = async () => {
    await discordService.connect();
    
    // #region Express config
    const app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(logger);

    app.post("/user", UserController.createUser);
    app.put("/user", UserController.updateUser);

    app.listen(PORT, () => {
        Logger.log("API started listening");
    })
    // #endregion
};

try {
    init();
} catch (error) {
    Logger.error("Couldn't start the app", error);
}
