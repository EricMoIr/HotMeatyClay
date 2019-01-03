import DiscordController from "controllers/DiscordController";
import Logger from "utils/Logger";
import DiscordService from "services/DiscordService";

const { DISCORD_TOKEN } = process.env;

abstract class DiscordWorker {
    static async login() {
        const controller = new DiscordController(DiscordService.instance);
        const client = DiscordService.instance.client;
        const beginning = Date.now();
        client.on("ready", async () => {
            await controller.ready();
            Logger.log(`Starting the bot took ${(Date.now() - beginning) / 1000} seconds`);
        });
        client.on("disconnect", (event) => controller.disconnect(event, DISCORD_TOKEN));
        client.on("error", (error) => controller.error(error, DISCORD_TOKEN));
        client.on("guildMemberAdd", (newMember) => controller.guildMemberAdd(newMember));
        await client.login(DISCORD_TOKEN);
    }
}

export default DiscordWorker;