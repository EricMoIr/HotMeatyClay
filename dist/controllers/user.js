"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_1 = require("services/discord");
const ErrorHandler_1 = require("utils/ErrorHandler");
const discordService = discord_1.default.instance;
exports.createUser = async (req, res) => {
    const ok = isBodyValid(req.body);
    if (!ok) {
        return ErrorHandler_1.sendError(res, "Body not valid", 400);
    }
    const { username, discordId } = req.body;
    const result = await discordService.renameMember(username, discordId);
    if (result) {
        return res.json();
    }
    return ErrorHandler_1.sendError(res, "Couldn't rename member", 500);
};
function isBodyValid(body) {
    return body && body.username && body.discordId;
}
//# sourceMappingURL=user.js.map