"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const querystring = require("querystring");
const discord_1 = require("services/discord");
const Logger_1 = require("utils/Logger");
const discordService = discord_1.default.instance;
const { GAME_TOKEN } = process.env;
const DAILY = 1000 * 60 * 60 * 24;
const GAME_URI = "https://system.undeaddawn.com/discord/";
const USER_DATA_URI = "getuserdata.php";
exports.startUpdating = async () => {
    exports.updateUsersInfo();
    setInterval(exports.updateUsersInfo, DAILY);
};
const fetch = async (uri, body) => {
    try {
        const { data } = await axios_1.default.post(uri, querystring.stringify(body), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        return data;
    }
    catch (error) {
        Logger_1.default.error("Couldn't connect to the game's backend", error);
        return { error };
    }
};
exports.updateUserInfo = async (discordid) => {
    const body = {
        discordid,
        quickkey: GAME_TOKEN,
        action: "user",
    };
    const { banned, name, prefix, member, error } = await fetch(GAME_URI + USER_DATA_URI, body);
    if (error) {
        return { error };
    }
    const serviceError = await discordService.handleUser(name, discordid, banned);
    if (serviceError) {
        Logger_1.default.error(serviceError);
    }
};
exports.updateUsersInfo = async () => {
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
            Logger_1.default.error(result);
        }
    });
};
//# sourceMappingURL=game.js.map