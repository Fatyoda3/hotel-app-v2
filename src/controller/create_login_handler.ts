import { type Request, type Response } from "express";
import { type LoginService } from "../types/user_type.js";

export const createLoginHandler = (loginService: LoginService) => {
  return (request: Request, response: Response): void => {
    const body = request.body;

    if (body === undefined) {
      response.status(400).json({ error: "Request body is required." });
      return;
    }

    const emailValue = body.email;
    const passwordValue = body.password;
    console.log({ requestBody: body });
    console.log({ emailValue, passwordValue });
    if (typeof emailValue !== "string" || typeof passwordValue !== "string") {
      response
        .status(400)
        .json({ error: "Email and password must be strings." });
      return;
    }

    const result = loginService.login({
      email: emailValue,
      password: passwordValue,
    });

    if (result.success === true) {
      response.status(200).json(result);
      return;
    }

    response.status(401).json(result);
  };
};
