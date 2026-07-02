import request from "supertest";
import { createApp } from "../../src/controller/create_app.js";
import { createInMemoryUserRepository } from "../../src/repository/user_repository.js";
import { createLoginService } from "../../src/service/login_service.js";
import { InMemoryHotelSearchService } from "../../src/repository/in_mem.js";
import { AppDependencies, Hotel } from "../../src/types/hotel_type.js";
import { createRegisterService } from "../../src/service/register_service.js";
import { describe, it, expect, beforeAll } from "@jest/globals";

describe("Hotel API Acceptance Tests", () => {
  let app: ReturnType<typeof createApp>;

  const seedHotels: Hotel[] = [
    {
      id: "1",
      name: "Tokyo Tower Inn",
      city: "Tokyo",
      price: 150,
      rating: 4.9,
    },
  ];

  beforeAll(() => {
    const userRepository = createInMemoryUserRepository();
    const loginService = createLoginService(userRepository, "secret");
    const hotelSearchService = new InMemoryHotelSearchService(seedHotels);

    // Fallback stub if createRegisterService isn't fully implemented in your codebase yet
    const registerService = createRegisterService
      ? createRegisterService(userRepository)
      : {
          register: (req: any) => {
            userRepository.saveUser({ id: "u1", ...req });
            return { success: true, message: "registered" };
          },
        };

    const dependencies: AppDependencies = {
      hotelSearchService,
      loginService,
      registerService,
      loggerUtility: () => undefined,
    };

    app = createApp(dependencies);
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
