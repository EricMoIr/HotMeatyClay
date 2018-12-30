"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const Logger_1 = require("utils/Logger");
const UserController = require("controllers/user");
const discord_1 = require("services/discord");
const discordService = discord_1.default.instance;
const { PORT } = process.env;
const init = async () => {
    await discordService.connect();
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.post("/user", UserController.createUser);
    app.listen(PORT, () => {
        Logger_1.default.log("API started listening");
    });
};
try {
    init();
}
catch (error) {
    Logger_1.default.error("Couldn't start the app", error);
}
//# sourceMappingURL=app.js.map