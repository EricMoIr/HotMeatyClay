"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("utils/Logger");
const logger = (req, _, next) => {
    Logger_1.default.log(`${req.method.toUpperCase()} ${req.originalUrl}`, req.body);
    next();
};
exports.default = logger;
//# sourceMappingURL=logger.js.map