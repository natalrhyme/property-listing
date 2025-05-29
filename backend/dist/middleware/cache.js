"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cache = void 0;
const redisClient_1 = require("../utils/redisClient");
const cache = (keyPrefix) => async (req, res, next) => {
    const key = keyPrefix + JSON.stringify(req.query);
    const cached = await redisClient_1.redisClient.get(key);
    if (cached) {
        return res.json(JSON.parse(cached));
    }
    // Monkey-patch res.json to cache the response
    const originalJson = res.json.bind(res);
    res.json = (body) => {
        redisClient_1.redisClient.set(key, JSON.stringify(body), "EX", 60); // 1 min cache
        return originalJson(body);
    };
    next();
};
exports.cache = cache;
