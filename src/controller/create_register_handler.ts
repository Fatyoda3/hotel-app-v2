import { type Request, type Response } from "express";
import { type RegisterService } from "../types/user_type.js";

export const createRegisterHandler = (registerService: RegisterService) => {
  return async (request: Request, response: Response): Promise<void> => {
    const { username, password } = response.locals.user;

    const result = await registerService.register({ username, password });

    if (result.success) {
      response.status(201).json(result);
      return;
    }

    response.status(400).json(result);
  };
};
