"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const Logger_1 = require("Logger");
const DiscordController = require("controllers/discord");
const { DISCORD_TOKEN } = process.env;
const init = async () => {
    const beginning = Date.now();
    const client = new Discord.Client();
    client.on("ready", async () => {
        await DiscordController.ready();
        Logger_1.default.log(`Starting the bot took ${(Date.now() - beginning) / 1000} seconds`);
    });
    client.on("disconnect", (event) => DiscordController.disconnect(event, client, DISCORD_TOKEN));
    client.on("error", (error) => DiscordController.error(error, client, DISCORD_TOKEN));
    await DiscordController.signIn(client, DISCORD_TOKEN);
};
try {
    init();
}
catch (error) {
    Logger_1.default.error("Couldn't start the app", error);
}
//# sourceMappingURL=app.js.map