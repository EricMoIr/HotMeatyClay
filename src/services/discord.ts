import { Client } from "discord.js";

import * as DiscordController from "controllers/discord";
import Logger from "utils/Logger";

const { DISCORD_TOKEN, GUILD_ID } = process.env;

class DiscordService {
    static instance = new DiscordService();
    client = new Client();

    connect = () => {
        return new Promise((resolve) => {
            const beginning = Date.now();
            this.client.on("ready", async () => {
                await DiscordController.ready();
                Logger.log(`Starting the bot took ${(Date.now() - beginning) / 1000} seconds`);
                resolve();
            });
            this.client.on("disconnect", (event) => DiscordController.disconnect(event, this.client, DISCORD_TOKEN));
            this.client.on("error", (error) => DiscordController.error(error, this.client, DISCORD_TOKEN));

            this.client.login(DISCORD_TOKEN);
        });
    };

    renameMember = async (username: string, discordId: string) => {
        const guild = this.client.guilds.find(({ id }) => id === GUILD_ID);
        if (!guild) {
            Logger.error(`Couldn't find the guild ${GUILD_ID}`);
            return false;
        }
        const toRename = guild.members.find(({ id }) => id === discordId);
        if (!toRename) {
            Logger.error(`Couldn't find the user ${discordId}`);
            return false;
        }
        try {
            await toRename.setNickname(username);
            return true;
        } catch (error) {
            Logger.error(`Couldn't rename ${discordId} to ${username}`, error);
            return false;
        }
    }
}

export default DiscordService;