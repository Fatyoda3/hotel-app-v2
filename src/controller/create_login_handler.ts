import { type Request, type Response } from "express";
import { type LoginService } from "../types/user_type.js";

export const createLoginHandler = (loginService: LoginService) => {
  return (request: Request, response: Response): void => {
    const body = request.body;

    if (body === undefined) {
      response.status(400).json({ error: "Request body is required." });
      return;
    }

    const usernameValue = body.username;
    const passwordValue = body.password;

    if (
      typeof usernameValue !== "string" ||
      typeof passwordValue !== "string"
    ) {
      response
        .status(400)
        .json({ error: "Username and password must be strings." });
      return;
    }

    const result = loginService.login({
      username: usernameValue,
      password: passwordValue,
    });

    if (result.success === true && typeof result.token === "string") {
      response.set("Authorization", result.token);
      response.status(200).json({
        success: true,
        message: result.message,
      });
      return;
    }

    response.status(401).json({
      success: false,
      message: result.message,
    });
  };
};
