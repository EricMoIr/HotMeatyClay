"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("utils/Logger");
exports.ready = async () => {
    Logger_1.default.log("Bot is ready");
};
exports.disconnect = async (_, client, token) => {
    try {
        Logger_1.default.warn("Was disconnected from discord.");
        await client.login(token);
    }
    catch (error) {
        await error(error, client, token);
    }
};
exports.error = async (thrownError, client, token) => {
    Logger_1.default.error("Error occurred", thrownError);
    try {
        await client.login(token);
    }
    catch (err) {
        await exports.error(err, client, token);
    }
};
//# sourceMappingURL=discord.js.map