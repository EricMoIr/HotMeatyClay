import * as Discord from "discord.js";

import Logger from "Logger";
import * as DiscordController from "controllers/discord";

const { DISCORD_TOKEN } = process.env;

const init = async () => {
    const beginning = Date.now();

    const client = new Discord.Client();

    //#region Discord config
    client.on("ready", async () => {
        await DiscordController.ready();
        Logger.log(`Starting the bot took ${(Date.now() - beginning) / 1000} seconds`);
    });
    client.on("disconnect", (event) => DiscordController.disconnect(event, client, DISCORD_TOKEN));
    client.on("error", (error) => DiscordController.error(error, client, DISCORD_TOKEN));
    //#endregion

    await DiscordController.signIn(client, DISCORD_TOKEN);
};

try {
    init();
} catch (error) {
    Logger.error("Couldn't start the app", error);
}
