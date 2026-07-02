import jwt from "jsonwebtoken";
import {
  type LoginRequest,
  type LoginResult,
  type LoginService,
  type PublicUser,
  type UserRepository,
} from "../types/user_type.js";

const createToken = (user: PublicUser, jwtSecret: string): string => {
  return jwt.sign({ sub: user.id, username: user.username }, jwtSecret, {
    expiresIn: "45m",
  });
};

const createPublicUser = ({
  id,
  username,
}: {
  id: string;
  username: string;
}): PublicUser => {
  return { id, username };
};

export const createLoginService = (
  userRepository: UserRepository,
  jwtSecret: string,
): LoginService => {
  return {
    login(request: LoginRequest): LoginResult {
      const username = request.username.trim().toLowerCase();
      const password = request.password.trim();

      if (username === "" || password === "") {
        return {
          success: false,
          message: "Username and password are required.",
        };
      }

      const user = userRepository.findUserByUsername(username);

      if (user === undefined || user.password !== password) {
        return {
          success: false,
          message: "Invalid credentials.",
        };
      }

      const publicUser = createPublicUser(user);
      const token = createToken(publicUser, jwtSecret);

      return {
        success: true,
        message: "Login successful.",
        token: `Bearer ${token}`,
        user: publicUser,
      };
    },
  };
};
