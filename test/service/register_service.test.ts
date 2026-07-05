import { describe, it, expect, beforeEach } from "@jest/globals";
import { createRegisterService } from "../../src/service/register_service.js";
import { createInMemoryUserRepository } from "../../src/repository/user_repository.js";
import { type UserRepo } from "../../src/types/user_type.js";

describe("Register Service", () => {
  let userRepository: UserRepo;
  let registerService: ReturnType<typeof createRegisterService>;

  beforeEach(() => {
    userRepository = createInMemoryUserRepository();
    registerService = createRegisterService(userRepository, {
      compare: (password, hashed) => password === hashed,
      encrypt: (password) => password,
    });
  });

  it("should successfully register a new user", async () => {
    const result = await registerService.register({
      username: "newuser",
      password: "password123",
    });
    expect(result.success).toBe(true);
    expect(result.user?.username).toBe("newuser");
  });

  it("should fail if username or password is empty", async () => {
    const result = await registerService.register({
      username: "",
      password: "123",
    });
    expect(result.success).toBe(false);
    expect(result.message).toBe("Username, and password are required.");
  });

  it("should fail if user already exists", async () => {
    registerService.register({
      username: "existinguser",
      password: "password123",
    });

    const result = await registerService.register({
      username: "existinguser",
      password: "newpassword",
    });

    expect(result.success).toBe(false);
  });
});
