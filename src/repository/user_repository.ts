import { type User, type UserRepository } from "../types/user_type.js";

const users: User[] = [];

export const createInMemoryUserRepository = (): UserRepository => {
  return {
    findUserByUsername(username: string): User | undefined {
      const normalizedUsername = username.trim().toLowerCase();
      return users.find(
        (user: User) => user.username.toLowerCase() === normalizedUsername,
      );
    },
    saveUser(user: User): void {
      users.push(user);
    },
  };
};
