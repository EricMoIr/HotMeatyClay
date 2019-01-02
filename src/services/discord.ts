import { Client } from "discord.js";

import * as DiscordController from "controllers/discord";
import Logger from "utils/Logger";

const { DISCORD_TOKEN, GUILD_ID } = process.env;

class DiscordService {
    static instance = new DiscordService();
    client = new Client();
    guild = null;

    connect = () => {
        return new Promise((resolve) => {
            const beginning = Date.now();
            this.client.on("ready", async () => {
                await DiscordController.ready();
                Logger.log(`Starting the bot took ${(Date.now() - beginning) / 1000} seconds`);
                this.initGuild();
                resolve();
            });
            this.client.on("disconnect", (event) => DiscordController.disconnect(event, this.client, DISCORD_TOKEN));
            this.client.on("error", (error) => DiscordController.error(error, this.client, DISCORD_TOKEN));
            this.client.on("guildMemberAdd", (newMember) => DiscordController.guildMemberAdd(newMember));

            this.client.login(DISCORD_TOKEN);
        });
    };

    handleUser = async (username: string, discordId: string, isBanned?: boolean) => {
        let result = await this.renameMember(username, discordId);
        if (!result) {
            return "Couldn't rename member. The bot is probably missing permissions.";
        }
        if (isBanned) {
            result = await this.handleBannedUser(discordId);
            if (!result) {
                return "Couldn't handle banned user. The bot is probably missing permissions.";
            }
        }
        return null;
    }

    private initGuild = () => {
        this.guild = this.client.guilds.find(({ id }) => id === GUILD_ID);
        if (!this.guild) {
            Logger.error(`Couldn't initialize the guild`);
        }
    }

    private renameMember = async (username: string, discordId: string) => {
        if (!this.guild) {
            Logger.error(`The guild wasn't initialized`);
            return false;
        }
        const toRename = this.guild.members.find(({ id }) => id === discordId);
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

    private handleBannedUser = async (discordId: string) => {
        if (!this.guild) {
            Logger.error(`The guild wasn't initialized`);
            return false;
        }
        const toHandle = this.guild.members.find(({ id }) => id === discordId);
        if (!toHandle) {
            Logger.error(`Couldn't find the user ${discordId}`);
            return false;
        }

        let role = this.guild.roles.find(({ name }) => name.toLowerCase().includes("banned"));
        if (!role) {
            Logger.warn(`Couldn't find the banned role. Attempting to create it...`);
            role = await this.guild.createRole({
                name: "Banned",
            });
            const promises = this.guild.channels.map((channel) => {
                return channel.overwritePermissions(role, { 
                    "SEND_MESSAGES": false,
                    "SPEAK": false,
                    "ADD_REACTIONS": false,
                });
            });
            try {
                await Promise.all(promises);
            } catch(error) {
                Logger.error(`Couldn't create the banned role`, error);
                return false;
            }
        }
        try {
            await toHandle.addRole(role);
            return true;
        } catch (error) {
            Logger.error(`Couldn't add the banned role to ${discordId}`, error);
            return false;
        }
    }
}

export default DiscordService;