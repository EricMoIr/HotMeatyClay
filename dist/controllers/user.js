"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_1 = require("services/discord");
const ErrorHandler_1 = require("utils/ErrorHandler");
const discordService = discord_1.default.instance;
function validateRequest(res, predicate, ...args) {
    if (!predicate(...args)) {
        return ErrorHandler_1.sendError(res, "Request not valid. Read the docs. I wrote them for you, nab.", 400);
    }
    return true;
}
exports.createUser = async (req, res) => {
    function isRequestValid(body) {
        return body && body.username && body.discordId;
    }
    if (!validateRequest(res, isRequestValid, req.body)) {
        return;
    }
    const { username, isBanned, discordId } = req.body;
    const error = await discordService.handleUser(username, discordId, isBanned);
    if (error) {
        return ErrorHandler_1.sendError(res, error, 500);
    }
    return res.json();
};
exports.updateUser = async (req, res) => {
    function isRequestValid(body, params) {
        return body && body.username && params.id;
    }
    if (!validateRequest(res, isRequestValid, req.body, req.params)) {
        return;
    }
    const { username, isBanned } = req.body;
    const { id } = req.params;
    const error = await discordService.handleUser(username, id, isBanned);
    if (error) {
        return ErrorHandler_1.sendError(res, error, 500);
    }
    return res.json();
};
//# sourceMappingURL=user.js.map