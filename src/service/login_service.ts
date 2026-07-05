import jwt from "jsonwebtoken";
import * as T from "../types/user_type.js";
import { hasInvalidCredentials, PasswordUtility } from "../utils/utils.js";
import bcrypt from "bcrypt";
const createToken = (user: T.PublicUser, jwtSecret: string): string => {
  const payload = { sub: user.id, username: user.username };
  return jwt.sign(payload, jwtSecret, { expiresIn: "45m" });
};

export const createLoginService = (
  userRepo: T.UserRepo,
  secret: string,
  passwordUtility: PasswordUtility,
): T.LoginService => {
  return {
    login(request: T.LoginRequest): T.LoginResult {
      const username = request.username.trim().toLowerCase();
      const password = request.password.trim();
      const user = userRepo.findUserByUsername(username);

      if (hasInvalidCredentials(username, password)) {
        return {
          success: false,
          message: "Username and password are required.",
        };
      }

      if (
        user === undefined ||
        !passwordUtility.compare(password, user.password)
      ) {
        return {
          success: false,
          message: "Invalid credentials.",
        };
      }

      const publicUser: T.PublicUser = { id: user.id, username: user.username };
      const token = createToken(publicUser, secret);

      return {
        success: true,
        message: "Login successful.",
        token: `Bearer ${token}`,
        user: publicUser,
      };
    },
  };
};
