import {
  type RegisterRequest,
  type RegisterResult,
  type RegisterService,
  type UserRepo,
} from "../types/user_type.js";
import { hasInvalidCredentials } from "../utils/utils.js";

export const createRegisterService = (
  userRepository: UserRepo,
): RegisterService => {
  return {
    register(request: RegisterRequest): RegisterResult {
      const username = request.username.trim();
      const password = request.password.trim();

      if (hasInvalidCredentials(username, password)) {
        return {
          success: false,
          message: "Username, and password are required.",
        };
      }

      const existingUser = userRepository.findUserByUsername(username);

      if (existingUser !== undefined) {
        return {
          success: false,
          message: "Username already exists.",
        };
      }

      const newUser = { id: crypto.randomUUID(), username, password };

      userRepository.saveUser(newUser);

      return {
        success: true,
        message: "Registration successful.",
        user: {
          id: newUser.id,
          username: newUser.username,
        },
      };
    },
  };
};
