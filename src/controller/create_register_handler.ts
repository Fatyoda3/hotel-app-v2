import { type Request, type Response } from "express";
import { type RegisterService } from "../types/user_type.js";

export const createRegisterHandler = (registerService: RegisterService) => {
  return (request: Request, response: Response): void => {
    const body = request.body;

    if (body === undefined) {
      response.status(400).json({ error: "Request body is required." });
      return;
    }

    const username = body.username;
    const password = body.password;

    if (typeof username !== "string" || typeof password !== "string") {
      response
        .status(400)
        .json({ error: "Username and password must be strings." });
      return;
    }

    const result = registerService.register({ username, password });

    if (result.success === true) {
      response.status(201).json(result);
      return;
    }

    response.status(400).json(result);
  };
};
