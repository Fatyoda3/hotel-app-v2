import {
  type RegisterRequest,
  type RegisterResult,
  type RegisterService,
  type UserRepo,
} from "../types/user_type.js";
import { hasInvalidCredentials, type PasswordUtility } from "../utils/utils.js";

export const createRegisterService = (
  userRepository: UserRepo,
  passwordUtility: PasswordUtility,
): RegisterService => {
  return {
    async register(request: RegisterRequest): Promise<RegisterResult> {
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

      const hashedPassword = passwordUtility.encrypt(password);

      const newUser = {
        id: crypto.randomUUID(),
        username,
        password: hashedPassword,
      };

      await userRepository.saveUser(newUser);

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
