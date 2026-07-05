import request from "supertest";
import { createApp } from "../../src/controller/create_app.js";
import { HotelRepo, Acknowledgement } from "../../src/types/hotel_type.js";

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
  let mockHotelRepo: jest.Mocked<HotelRepo>;

  beforeEach(() => {
    mockHotelRepo = {
      searchHotels: jest.fn<HotelRepo["searchHotels"]>(),
      searchHotelById: jest.fn<HotelRepo["searchHotelById"]>(),
      createBooking: jest.fn<HotelRepo["createBooking"]>(),
    };

    mockBookingService = jest.fn<BookingService>();

    const dependencies: AppDependencies = {
      hotelRepo: mockHotelRepo,
      loginService: { login: jest.fn() as any },
      registerService: { register: jest.fn() as any },
      bookingService: mockBookingService,
    };

    const middleware: Middleware = {
      loggerUtility: (message: string) => undefined,

      authenticateToken: (req: Request, res: Response, next: NextFunction) => {
        res.locals.user = { username: "testuser" };
        next();
      },

      validateUser: (req: Request, res: Response, next: NextFunction) => {
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

    mockBookingService.mockReturnValue(mockAck);

    const response = await request(app)
      .post("/api/bookings")
      .send({ hotel_id: 1, rooms: 2 });

    expect(response.status).toBe(200);
    expect(response.body.acknowledgement).toEqual(mockAck);
    expect(mockBookingService).toHaveBeenCalledWith(1, 2, mockHotelRepo);
  });
});
