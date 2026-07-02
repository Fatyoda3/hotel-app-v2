import request from "supertest";
import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { createApp } from "../../src/controller/create_app.js";
import {
  AppDependencies,
  HotelSearchService,
} from "../../src/types/hotel_type.js";
import { LoginService, RegisterService } from "../../src/types/user_type.js";

describe("POST /api/users/login", () => {
  let app: ReturnType<typeof createApp>;
  let mockLoginService: jest.Mocked<LoginService>;

  beforeEach(() => {
    mockLoginService = { login: jest.fn<LoginService["login"]>() };
    const dependencies: AppDependencies = {
      hotelSearchService: {
        searchHotels: jest.fn<HotelSearchService["searchHotels"]>(),
      },
      loginService: mockLoginService,
      registerService: { register: jest.fn<RegisterService["register"]>() },
      loggerUtility: (message) => undefined,
    };
    app = createApp(dependencies);
  });

  it("should return 400 if body is entirely missing", async () => {
    // Sending text/plain bypasses express.json(), making req.body undefined
    const response = await request(app)
      .post("/api/users/login")
      .set("Content-Type", "text/plain")
      .send("not json");
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Request body is required.");
  });

  it("should return 400 if username or password are not strings", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send({ username: 123, password: [] });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Username and password must be strings.");
  });

  it("should return 401 if login fails", async () => {
    mockLoginService.login.mockReturnValue({
      success: false,
      message: "Invalid credentials.",
    });
    const response = await request(app)
      .post("/api/users/login")
      .send({ username: "u", password: "p" });
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid credentials.");
  });
});
