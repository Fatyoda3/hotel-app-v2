import {
  type RegisterRequest,
  type RegisterResult,
  type RegisterService,
  type UserRepository,
} from "../types/user_type.js";

export const createRegisterService = (
  userRepository: UserRepository,
): RegisterService => {
  return {
    register(request: RegisterRequest): RegisterResult {
      const username = request.username.trim();
      const password = request.password.trim();

      if (username === "" || password === "") {
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

      const newUser = {
        id: crypto.randomUUID(),
        username: request.username.trim(),
        password: password,
      };

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
