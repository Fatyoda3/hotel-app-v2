import request from "supertest";
import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { createApp } from "../../src/controller/create_app.js";
import {
  AppDependencies,
  HotelSearchService,
} from "../../src/types/hotel_type.js";
import { RegisterService } from "../../src/types/user_type.js";

describe("POST /api/users/register", () => {
  let app: ReturnType<typeof createApp>;
  let mockRegisterService: jest.Mocked<RegisterService>;

  beforeEach(() => {
    mockRegisterService = { register: jest.fn<RegisterService["register"]>() };
    const dependencies: AppDependencies = {
      hotelSearchService: {
        searchHotels: jest.fn<HotelSearchService["searchHotels"]>(),
      },
      loginService: { login: jest.fn() as any },
      registerService: mockRegisterService,
      loggerUtility: (message: string) => undefined,
    };
    app = createApp(dependencies);
  });

  it("should return 400 if body is entirely missing", async () => {
    const response = await request(app)
      .post("/api/users/register")
      .set("Content-Type", "text/plain")
      .send("not json");
    expect(response.status).toBe(400);
  });

  it("should return 400 if username or password are not strings", async () => {
    const response = await request(app)
      .post("/api/users/register")
      .send({ username: true, password: 123 });
    expect(response.status).toBe(400);
  });

  it("should return error status if registration fails", async () => {
    mockRegisterService.register.mockReturnValue({
      success: false,
      message: "User exists",
    });

    const response = await request(app)
      .post("/api/users/register")
      .send({ username: "u", password: "p" });

    expect(response.body.success).toBe(false);
  });
});
