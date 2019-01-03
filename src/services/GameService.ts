import axios from "axios";
import * as querystring from "querystring";

import Logger from "utils/Logger";
import DiscordService from "services/DiscordService";

const { GAME_TOKEN } = process.env;

const DAILY = 1000 * 60 * 60 * 24;
const GAME_URI = "https://system.undeaddawn.com/discord/";
const USER_DATA_URI = "getuserdata.php";

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

class GameService {
    discordService: DiscordService;

    constructor(discordService: DiscordService) {
        this.discordService = discordService;
    }

    async startUpdating() {
        this.updateUsersInfo();
        setInterval(this.updateUsersInfo, DAILY);
    };
    
    async getUserInfo(discordid: string) {
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
    
    async updateUserInfo(discordid: string) {
        const { banned, name, prefix, member, error } = await this.getUserInfo(discordid);
        if (error) {
            return { error };
        }
        const serviceError = await this.discordService.handleUser(name, discordid, banned);
        if (serviceError) {
            Logger.error(serviceError);
        }
    };
    
    async updateUsersInfo() {
        const body = {
            quickkey: GAME_TOKEN,
            action: "allusers",
        };
        const { users, error } = await fetch(GAME_URI + USER_DATA_URI, body);
        if (error) {
            return { error };
        }
    
        const promises = users.map(({ banned, name, prefix, member, discordid }) => {
            return this.discordService.handleUser(name, discordid, banned);
        });
        const results = await Promise.all(promises);
        results.forEach((result) => {
            if (result) {
                Logger.error(result);
            }
        });
    };
}

export default GameService;
