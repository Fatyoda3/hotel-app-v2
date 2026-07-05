import request from "supertest";
import { createApp } from "../../src/controller/create_app.js";
import { HotelRepo } from "../../src/types/hotel_type.js";
import { LoginService, RegisterService } from "../../src/types/user_type.js";
import {
  AppDependencies,
  Middleware,
  BookingService,
} from "../../src/types/app_dependency_type.js";
import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { Request, Response, NextFunction } from "express";

describe("GET /api/search/hotels", () => {
  let app: ReturnType<typeof createApp>;
  let mockHotelSearchService: jest.Mocked<HotelRepo>;

  beforeEach(() => {
    mockHotelSearchService = {
      searchHotels: jest.fn<HotelRepo["searchHotels"]>(),
      searchHotelById: jest.fn<HotelRepo["searchHotelById"]>(),
      createBooking: jest.fn<HotelRepo["createBooking"]>(),
    };

    const mockLoginService: LoginService = {
      login: jest.fn<LoginService["login"]>(),
    };
    const mockRegisterService: RegisterService = {
      register: jest.fn<RegisterService["register"]>(),
    };

    const dependencies: AppDependencies = {
      hotelRepo: mockHotelSearchService,
      loginService: mockLoginService,
      registerService: mockRegisterService,
      bookingService: jest.fn<BookingService>(),
    };

    const middleware: Middleware = {
      loggerUtility: (message: string) => undefined,
      authenticateToken: (req: Request, res: Response, next: NextFunction) =>
        next(),
      // ADDED: validateUser is required by the Middleware interface
      validateUser: (req: Request, res: Response, next: NextFunction) => next(),
    };

    app = createApp(dependencies, middleware);
  });

  it("should return 400 if city query parameter is missing", async () => {
    const response = await request(app).get("/api/search/hotels");

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("The city query parameter is required.");
  });

  it("should return 200 and a list of hotels for a valid query", async () => {
    mockHotelSearchService.searchHotels.mockReturnValue([
      {
        id: 1,
        name: "Mock Hotel",
        city: "London",
        price: 100,
        rating: 4.0,
        rooms: 10,
      },
    ]);

    const response = await request(app).get("/api/search/hotels?city=London");

    expect(response.status).toBe(200);
    expect(response.body.hotels).toHaveLength(1);
    expect(response.body.hotels[0].name).toBe("Mock Hotel");
    expect(mockHotelSearchService.searchHotels).toHaveBeenCalledWith("London");
  });
});
