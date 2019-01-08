import { GuildMember, Message } from "discord.js";

import Logger from "utils/Logger";
import DiscordService from "services/DiscordService";
import GameService from "services/GameService";
import Command from "commands/Command";
import commands from "commands";

const { PREFIX } = process.env;

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
        DiscordService.instance.initGuild();
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
    };
    
    message = async (message: Message) => {
        if (!message.content.startsWith(PREFIX)) {
            return;
        }
        const { command, params } = this.findCommand(message, commands);
        if (command) {
            Logger.log(`Executing the command ${command.name}. Fired by ${message.author.username}`);
            return command.execute(message, params);
        }
        Logger.warn(`I couldn't find a command in ${message.content}. Fired by ${message.author.username}`);
    };

    private findCommand(message: Message, commands: Command[]) {
        const content = message.content.substring(1);
        const result = {
            command: <Command> null,
            params: <string[]> null,
        }
        for (const command of commands) {
            const { command: foundCommand } = result;
    
            if (content.toLowerCase().startsWith(command.name.toLowerCase()) && 
            (content.length === command.name.length || content[command.name.length] === " ") &&
            (!foundCommand || command.name.length > foundCommand.name.length)) {
                result.command = command;
                result.params = content.substring(command.name.length + 1).split(/\s+/u);
            }
        }
        return result;
    }
};

export default DiscordController;