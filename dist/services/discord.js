"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const DiscordController = require("controllers/discord");
const Logger_1 = require("utils/Logger");
const { DISCORD_TOKEN, GUILD_ID } = process.env;
class DiscordService {
    constructor() {
        this.client = new discord_js_1.Client();
        this.guild = null;
        this.connect = () => {
            return new Promise((resolve) => {
                const beginning = Date.now();
                this.client.on("ready", async () => {
                    await DiscordController.ready();
                    Logger_1.default.log(`Starting the bot took ${(Date.now() - beginning) / 1000} seconds`);
                    this.initGuild();
                    resolve();
                });
                this.client.on("disconnect", (event) => DiscordController.disconnect(event, this.client, DISCORD_TOKEN));
                this.client.on("error", (error) => DiscordController.error(error, this.client, DISCORD_TOKEN));
                this.client.login(DISCORD_TOKEN);
            });
        };
        this.handleUser = async (username, discordId, isBanned) => {
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
        };
        this.initGuild = () => {
            this.guild = this.client.guilds.find(({ id }) => id === GUILD_ID);
            if (!this.guild) {
                Logger_1.default.error(`Couldn't initialize the guild`);
            }
        };
        this.renameMember = async (username, discordId) => {
            if (!this.guild) {
                Logger_1.default.error(`The guild wasn't initialized`);
                return false;
            }
            const toRename = this.guild.members.find(({ id }) => id === discordId);
            if (!toRename) {
                Logger_1.default.error(`Couldn't find the user ${discordId}`);
                return false;
            }
            try {
                await toRename.setNickname(username);
                return true;
            }
            catch (error) {
                Logger_1.default.error(`Couldn't rename ${discordId} to ${username}`, error);
                return false;
            }
        };
        this.handleBannedUser = async (discordId) => {
            if (!this.guild) {
                Logger_1.default.error(`The guild wasn't initialized`);
                return false;
            }
            const toHandle = this.guild.members.find(({ id }) => id === discordId);
            if (!toHandle) {
                Logger_1.default.error(`Couldn't find the user ${discordId}`);
                return false;
            }
            let role = this.guild.roles.find(({ name }) => name.toLowerCase().includes("banned"));
            if (!role) {
                Logger_1.default.warn(`Couldn't find the banned role. Attempting to create it...`);
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
                }
                catch (error) {
                    Logger_1.default.error(`Couldn't create the banned role`, error);
                    return false;
                }
            }
            try {
                await toHandle.addRole(role);
                return true;
            }
            catch (error) {
                Logger_1.default.error(`Couldn't add the banned role to ${discordId}`, error);
                return false;
            }
        };
    }
}
DiscordService.instance = new DiscordService();
exports.default = DiscordService;
//# sourceMappingURL=discord.js.map