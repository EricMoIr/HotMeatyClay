import { Client, GuildMember } from "discord.js";

import Logger from "utils/Logger";
import discord from "services/discord";
import * as gameService from "services/game";

const discordService = discord.instance;

export const ready = async () => {
    Logger.log("Bot is ready");
};

export const disconnect = async (_, client: Client, token: string) => {
    try {
        Logger.warn("Was disconnected from discord.");
        await client.login(token);
    } catch (error) {
        await error(error, client, token);
    }
};

export const error = async (thrownError: Error, client: Client, token: string) => {
    Logger.error("Error occurred", thrownError);
    try {
        await client.login(token);
    } catch (err) {
        await error(err, client, token);
    }
};

export const guildMemberAdd = async (newMember: GuildMember) => {
    const { banned, name, prefix, member, error } = await gameService.getUserInfo(newMember.id);
    if (error) {
        Logger.warn(error);
        return;
    }
    const serviceError = await discordService.handleUser(name, newMember.id, banned);
    if (serviceError) {
        Logger.error(serviceError);
    }
}