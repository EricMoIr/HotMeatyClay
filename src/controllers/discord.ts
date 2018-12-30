import { Client } from "discord.js";

import Logger from "Logger";

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

export const signIn = async (client: Client, token: string) => {
    try {
        Logger.log("Attempting to connect to discord...");
        await client.login(token);
    } catch (error) {
        Logger.error("Couldn't connect to discord", error);
    }
}