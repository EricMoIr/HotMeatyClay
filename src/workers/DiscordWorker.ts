import DiscordController from "controllers/DiscordController";
import Logger from "utils/Logger";
import DiscordService from "services/DiscordService";
import { Client } from "discord.js";
import GameService from "services/GameService";

const { DISCORD_TOKEN } = process.env;

abstract class DiscordWorker {
    static async start() {
        const client = new Client();

        DiscordService.setInstance(client);

        const beginning = Date.now();
        
        const controller = new DiscordController(DiscordService.instance);
        client.on("ready", async () => {
            await controller.ready();
            Logger.log(`Starting the bot took ${(Date.now() - beginning) / 1000} seconds`);
        });
        client.on("disconnect", (event) => controller.disconnect(event, DISCORD_TOKEN));
        client.on("error", (error) => controller.error(error, DISCORD_TOKEN));
        client.on("guildMemberAdd", (newMember) => controller.guildMemberAdd(newMember));

        await client.login(DISCORD_TOKEN);

        const gameService = new GameService(DiscordService.instance);
        await gameService.startUpdating();
    }
}

export default DiscordWorker;