import axios from "axios";
import * as querystring from "querystring";

import discord from "services/discord";
import Logger from "utils/Logger";

const discordService = discord.instance;
const { GAME_TOKEN } = process.env;

const DAILY = 1000 * 60 * 60 * 24;
const GAME_URI = "https://system.undeaddawn.com/discord/";
const USER_DATA_URI = "getuserdata.php";

export const startUpdating = async () => {
    updateUsersInfo();
    setInterval(updateUsersInfo, DAILY);
};

const fetch = async (uri: string, body: object) => {
    try {
        const { data } = await axios.post(uri,
            querystring.stringify(body),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            },
        );
        return data;
    } catch (error) {
        Logger.error("Couldn't connect to the game's backend", error);
        return { error };
    }
};

export const getUserInfo = async (discordid: string) => {
    const body = {
        discordid,
        quickkey: GAME_TOKEN,
        action: "user",
    };
    const { error, ...rest } = await fetch(GAME_URI + USER_DATA_URI, body);
    if (error) {
        return { error };
    }
    return rest;
}

export const updateUserInfo = async (discordid: string) => {
    const { banned, name, prefix, member, error } = await getUserInfo(discordid);
    if (error) {
        return { error };
    }
    const serviceError = await discordService.handleUser(name, discordid, banned);
    if (serviceError) {
        Logger.error(serviceError);
    }
};

export const updateUsersInfo = async () => {
    const body = {
        quickkey: GAME_TOKEN,
        action: "allusers",
    };
    const { users, error } = await fetch(GAME_URI + USER_DATA_URI, body);
    if (error) {
        return { error };
    }

    const promises = users.map(({ banned, name, prefix, member, discordid }) => {
        return discordService.handleUser(name, discordid, banned);
    });
    const results = await Promise.all(promises);
    results.forEach((result) => {
        if (result) {
            Logger.error(result);
        }
    });
};