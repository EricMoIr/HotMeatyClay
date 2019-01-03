import { GuildMember } from "discord.js";

import Logger from "utils/Logger";
import DiscordService from "services/DiscordService";
import GameService from "services/GameService";

class DiscordController {
    instance: DiscordController;
    discordService: DiscordService;
    gameService: GameService;

    constructor(service: DiscordService){
        this.discordService = service;
        this.gameService = new GameService(service);
        this.instance = this;
    }

    async ready() {
        Logger.log("Bot is ready");
    };
    
    async disconnect(_, token: string) {
        try {
            const client = this.discordService.client;
            Logger.warn("Was disconnected from discord.");
            await client.login(token);
        } catch (error) {
            await error(error, token);
        }
    };
    
    async error(thrownError: Error, token: string) {
        Logger.error("Error occurred", thrownError);
        try {
            const client = this.discordService.client;
            await client.login(token);
        } catch (err) {
            await this.error(err, token);
        }
    };
    
    async guildMemberAdd(newMember: GuildMember) {
        const { banned, name, prefix, member, error } = await this.gameService.getUserInfo(newMember.id);
        if (error) {
            Logger.warn(error);
            return;
        }
        const serviceError = await this.discordService.handleUser(name, newMember.id, banned);
        if (serviceError) {
            Logger.error(serviceError);
        }
    }
};

export default DiscordController;