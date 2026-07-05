import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";

export const createAuthenticateToken = (secret: string) => {
  const authenticateToken: RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access token required",
      });
    }

    const token = authHeader.split(" ")[1];

    try {
      const user = jwt.verify(token, secret);
      res.locals.user = user;
      next();
    } catch {
      return res.status(403).json({
        message: "Invalid or expired token",
      });
    }
  };
  return authenticateToken;
};
