import { type User, type UserRepo } from "../types/user_type.js";

export const createInMemoryUserRepository = (): UserRepo => {
  const users: User[] = [];
  return {
    findUserByUsername(username: string): User | undefined {
      const normalizedUsername = username.trim().toLowerCase();
      return users.find(
        (user: User) => user.username.toLowerCase() === normalizedUsername,
      );
    },

    async saveUser(user: User): Promise<void> {
      users.push(user);
    },
  };
};
