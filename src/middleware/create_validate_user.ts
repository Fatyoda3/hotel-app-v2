import { NextFunction, type Request, type Response } from "express";

export const createValidateUser = () => {
  return (request: Request, response: Response, next: NextFunction) => {
    const body = request.body;

    if (body === undefined) {
      response.status(400).json({ error: "Request body is required." });
      return;
    }
    const { username, password } = body;

    if (typeof username !== "string" || typeof password !== "string") {
      response
        .status(400)
        .json({ error: "Username and password must be strings." });
      return;
    }

    response.locals.user = { username, password };
    next();
  };
};
