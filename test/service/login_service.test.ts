import { createLoginService } from "../../src/service/login_service.js";
import { createInMemoryUserRepository } from "../../src/repository/user_repository.js";
import { type UserRepo } from "../../src/types/user_type.js";
import { describe, it, expect, beforeEach } from "@jest/globals";

describe("Login Service", () => {
  let userRepository: UserRepo;
  let loginService: ReturnType<typeof createLoginService>;
  const jwtSecret = "test-secret";

  beforeEach(() => {
    userRepository = createInMemoryUserRepository();
    loginService = createLoginService(userRepository, jwtSecret);

    // Seed a test user
    userRepository.saveUser({
      id: "user-1",
      username: "testuser",
      password: "password123",
    });
  });

  it("should successfully login with valid credentials", () => {
    const result = loginService.login({
      username: "testuser",
      password: "password123",
    });

    expect(result.success).toBe(true);
    expect(result.token).toMatch(/^Bearer .+/);
    expect(result.user?.username).toBe("testuser");
  });

  it("should normalize username to lowercase during login", () => {
    const result = loginService.login({
      username: "TESTUSER", // Uppercase
      password: "password123",
    });

    expect(result.success).toBe(true);
  });

  it("should fail if username does not exist", () => {
    const result = loginService.login({
      username: "unknown",
      password: "password123",
    });

    expect(result.success).toBe(false);
    expect(result.message).toBe("Invalid credentials.");
  });

  it("should fail if password is incorrect", () => {
    const result = loginService.login({
      username: "testuser",
      password: "wrongpassword",
    });

    expect(result.success).toBe(false);
    expect(result.message).toBe("Invalid credentials.");
  });

  it("should return failure if username or password is empty", () => {
    const result = loginService.login({
      username: "   ", // Testing the .trim() logic
      password: "",
    });

    expect(result.success).toBe(false);
    expect(result.message).toBe("Username and password are required.");
  });
});
