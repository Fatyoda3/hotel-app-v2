import request from "supertest";
import { createApp } from "../../src/controller/create_app.js";
import { createInMemoryUserRepository } from "../../src/repository/user_repository.js";
import { createLoginService } from "../../src/service/login_service.js";
import { InMemoryHotelSearchService } from "../../src/repository/in_mem.js";
import { Hotel } from "../../src/types/hotel_type.js";
import { createRegisterService } from "../../src/service/register_service.js";
import {
  AppDependencies,
  Middleware,
  BookingService,
} from "../../src/types/app_dependency_type.js";
import { describe, it, expect, beforeAll, jest } from "@jest/globals";
import { Request, Response, NextFunction } from "express";

describe("Hotel API Acceptance Tests", () => {
  let app: ReturnType<typeof createApp>;

  const seedHotels: Hotel[] = [
    {
      id: 1,
      name: "Tokyo Tower Inn",
      city: "Tokyo",
      price: 150,
      rating: 4.9,
    },
  ];

  beforeAll(() => {
    const userRepository = createInMemoryUserRepository();
    const loginService = createLoginService(userRepository, "secret", {
      compare: (p, h) => p === h,
      encrypt: (p) => p,
    });
    const hotelSearchService = new InMemoryHotelSearchService(seedHotels);

    const registerService = createRegisterService
      ? createRegisterService(userRepository, {
          compare: (p, h) => p === h,
          encrypt: (p) => p,
        })
      : {
          register: async (req: any) => {
            userRepository.saveUser({ id: "u1", ...req });
            return { success: true, message: "registered" };
          },
        };

    const dependencies: AppDependencies = {
      hotelSearchService,
      loginService,
      registerService,
      bookingService: jest.fn<BookingService>(),
    };

    const middleware: Middleware = {
      loggerUtility: () => undefined,
      authenticateToken: (req: Request, res: Response, next: NextFunction) =>
        next(),
    };

    app = createApp(dependencies, middleware);
  });

  it("Complete Flow: Register -> Login -> Search", async () => {
    const registerRes = await request(app)
      .post("/api/users/register")
      .send({ username: "traveler", password: "securepass" });

    expect(registerRes.status).toBe(201);

    const loginRes = await request(app)
      .post("/api/users/login")
      .send({ username: "traveler", password: "securepass" });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.success).toBe(true);
    expect(loginRes.headers.authorization).toMatch(/^Bearer /);

    const searchRes = await request(app)
      .get("/api/search/hotels?city=tokyo")
      .send();

    expect(searchRes.body.hotels).toHaveLength(1);
    expect(searchRes.body.hotels[0].name).toBe("Tokyo Tower Inn");
  });
});
