import { Request, Response, NextFunction } from "express";
import { redisClient } from "../utils/redisClient";

export const cache = (keyPrefix: string) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const key = keyPrefix + JSON.stringify(req.query);
  const cached = await redisClient.get(key);
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  // Monkey-patch res.json to cache the response
  const originalJson = res.json.bind(res);
  res.json = (body: any) => {
    redisClient.set(key, JSON.stringify(body), "EX", 60); // 1 min cache
    return originalJson(body);
  };
  next();
}; 