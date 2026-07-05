import { type Request, type Response } from "express";
import { type LoginService } from "../types/user_type.js";

export const createLoginHandler = (loginService: LoginService) => {
  return (request: Request, response: Response): void => {
    const { username, password } = response.locals.user;

    const { success, message, token } = loginService.login({
      username,
      password,
    });

    if (success && typeof token === "string") {
      response.set("Authorization", token);
      response.status(200).json({ success, message });
      return;
    }

    response.status(401).json({ success, message });
  };
};
