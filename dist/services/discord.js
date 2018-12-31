"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const DiscordController = require("controllers/discord");
const Logger_1 = require("utils/Logger");
const { DISCORD_TOKEN, GUILD_ID } = process.env;
class DiscordService {
    constructor() {
        this.client = new discord_js_1.Client();
        this.connect = () => {
            return new Promise((resolve) => {
                const beginning = Date.now();
                this.client.on("ready", async () => {
                    await DiscordController.ready();
                    Logger_1.default.log(`Starting the bot took ${(Date.now() - beginning) / 1000} seconds`);
                    resolve();
                });
                this.client.on("disconnect", (event) => DiscordController.disconnect(event, this.client, DISCORD_TOKEN));
                this.client.on("error", (error) => DiscordController.error(error, this.client, DISCORD_TOKEN));
                this.client.login(DISCORD_TOKEN);
            });
        };
        this.renameMember = async (username, discordId) => {
            const guild = this.client.guilds.find(({ id }) => id === GUILD_ID);
            if (!guild) {
                Logger_1.default.error(`Couldn't find the guild ${GUILD_ID}`);
                return false;
            }
            const toRename = guild.members.find(({ id }) => id === discordId);
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
            const guild = this.client.guilds.find(({ id }) => id === GUILD_ID);
            if (!guild) {
                Logger_1.default.error(`Couldn't find the guild ${GUILD_ID}`);
                return false;
            }
            const toHandle = guild.members.find(({ id }) => id === discordId);
            if (!toHandle) {
                Logger_1.default.error(`Couldn't find the user ${discordId}`);
                return false;
            }
            let role = guild.roles.find(({ name }) => name.toLowerCase().includes("banned"));
            if (!role) {
                Logger_1.default.warn(`Couldn't find the banned role. Attempting to create it...`);
                role = await guild.createRole({
                    name: "Banned",
                });
                const promises = guild.channels.map((channel) => {
                    if (channel.name.toLocaleLowerCase().includes("ban")) {
                        return channel.overwritePermissions(role, { "SEND_MESSAGES": true });
                    }
                    return channel.overwritePermissions(role, { "SEND_MESSAGES": false, "SPEAK": false });
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