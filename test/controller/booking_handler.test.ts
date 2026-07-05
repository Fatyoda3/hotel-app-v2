import request from "supertest";
import { createApp } from "../../src/controller/create_app.js";
import {
  HotelSearchService,
  Acknowledgement,
} from "../../src/types/hotel_type.js";
import {
  AppDependencies,
  Middleware,
  BookingService,
} from "../../src/types/app_dependency_type.js";
import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { Request, Response, NextFunction } from "express";

describe("POST /api/bookings", () => {
  let app: ReturnType<typeof createApp>;
  let mockBookingService: jest.MockedFunction<BookingService>;
  let mockHotelSearchService: jest.Mocked<HotelSearchService>;

  beforeEach(() => {
    mockHotelSearchService = {
      searchHotels: jest.fn<HotelSearchService["searchHotels"]>(),
      searchHotelById: jest.fn<HotelSearchService["searchHotelById"]>(),
      createBooking: jest.fn<HotelSearchService["createBooking"]>(),
    };

    mockBookingService = jest.fn<BookingService>();

    const dependencies: AppDependencies = {
      hotelSearchService: mockHotelSearchService,
      loginService: { login: jest.fn() as any },
      registerService: { register: jest.fn() as any },
      bookingService: mockBookingService,
    };

    const middleware: Middleware = {
      loggerUtility: (message: string) => undefined,
      authenticateToken: (req: Request, res: Response, next: NextFunction) => {
        // Mock the token authentication middleware by attaching a dummy user
        res.locals.user = { username: "testuser" };
        next();
      },
    };

    app = createApp(dependencies, middleware);
  });

  it("should successfully trigger the booking service and return an acknowledgement", async () => {
    const mockAck: Acknowledgement = {
      receiptId: "1   --- rooms2",
      message: "created booking",
    };

    // Setup our mocked booking service to return a successful acknowledgement
    mockBookingService.mockReturnValue(mockAck);

    const response = await request(app)
      .post("/api/bookings")
      .send({ hotel_id: 1, rooms: 2 });

    expect(response.status).toBe(200);
    expect(response.body.acknowledgement).toEqual(mockAck);
    expect(mockBookingService).toHaveBeenCalledWith(
      1,
      2,
      mockHotelSearchService,
    );
  });
});
