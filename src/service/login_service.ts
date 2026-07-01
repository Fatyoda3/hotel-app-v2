import {
  type LoginRequest,
  type LoginResult,
  type LoginService,
} from "../types/user_type.js";
import { type UserRepository } from "../types/user_type.js";

export const createLoginService = (
  userRepository: UserRepository,
): LoginService => {
  return {
    login(request: LoginRequest): LoginResult {
      const normalizedEmail = request.email.trim().toLowerCase();
      const normalizedPassword = request.password.trim();

      if (normalizedEmail === "" || normalizedPassword === "") {
        return {
          success: false,
          message: "Email and password are required.",
        };
      }

      const user = userRepository.findUserByEmail(normalizedEmail);

      if (user === undefined) {
        return {
          success: false,
          message: "Invalid credentials.",
        };
      }

      if (user.password !== normalizedPassword) {
        return {
          success: false,
          message: "Invalid credentials.",
        };
      }

      return {
        success: true,
        message: "Login successful.",
        user,
      };
    },
  };
};
