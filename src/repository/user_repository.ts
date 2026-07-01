import { type User, type UserRepository } from "../types/user_type.js";

const users: User[] = [
  {
    id: "u1",
    email: "admin@example.com",
    password: "password123",
    name: "Admin User",
  },
  {
    id: "u2",
    email: "guest@example.com",
    password: "welcome123",
    name: "Guest User",
  },
];

export const createInMemoryUserRepository = (): UserRepository => {
  return {
    findUserByEmail(email: string): User | undefined {
      const normalizedEmail = email.trim().toLowerCase();
      return users.find(
        (user: User) => user.email.toLowerCase() === normalizedEmail,
      );
    },
  };
};
