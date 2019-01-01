"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const Logger_1 = require("utils/Logger");
const logger_1 = require("middlewares/logger");
const UserController = require("controllers/user");
const discord_1 = require("services/discord");
const game = require("services/game");
const discordService = discord_1.default.instance;
const gameService = game;
const { PORT } = process.env;
const init = async () => {
    await discordService.connect();
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(logger_1.default);
    app.post("/user", UserController.createUser);
    app.put("/user", UserController.updateUser);
    app.listen(PORT, () => {
        Logger_1.default.log("API started listening");
    });
    await gameService.startUpdating();
};
try {
    init();
}
catch (error) {
    Logger_1.default.error("Couldn't start the app", error);
}
//# sourceMappingURL=app.js.map