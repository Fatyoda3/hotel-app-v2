import { describe, it, expect, beforeEach } from "@jest/globals";
import { createRegisterService } from "../../src/service/register_service.js";
import { createInMemoryUserRepository } from "../../src/repository/user_repository.js";
import { type UserRepository } from "../../src/types/user_type.js";

describe("Register Service", () => {
  let userRepository: UserRepository;
  let registerService: ReturnType<typeof createRegisterService>;

  beforeEach(() => {
    userRepository = createInMemoryUserRepository();
    registerService = createRegisterService(userRepository);
  });

  it("should successfully register a new user", () => {
    const result = registerService.register({
      username: "newuser",
      password: "password123",
    });
    expect(result.success).toBe(true);
    expect(result.user?.username).toBe("newuser");
  });

  it("should fail if username or password is empty", () => {
    const result = registerService.register({ username: "", password: "123" });
    expect(result.success).toBe(false);
    expect(result.message).toBe("Username, and password are required."); // Adjust to your actual error message
  });

  it("should fail if user already exists", () => {
    // Register once
    registerService.register({
      username: "existinguser",
      password: "password123",
    });
    // Try again
    const result = registerService.register({
      username: "existinguser",
      password: "newpassword",
    });

    expect(result.success).toBe(false);
  });
});
