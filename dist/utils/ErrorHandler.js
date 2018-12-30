"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("./Logger");
exports.sendError = (res, message, code) => {
    Logger_1.default.error(message);
    res.status(code);
    return res.json({
        error: message,
    });
};
//# sourceMappingURL=ErrorHandler.js.map