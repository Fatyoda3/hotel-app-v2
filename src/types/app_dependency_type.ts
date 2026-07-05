import { RequestHandler } from "express";
import { Acknowledgement, HotelRepo, NotBookedError } from "./hotel_type.js";
import type { LoginService, RegisterService } from "./user_type.js";

export interface AppDependencies {
  hotelRepo: HotelRepo;
  loginService: LoginService;
  registerService: RegisterService;
  bookingService: BookingService;
}

export interface Middleware {
  loggerUtility: (message: string) => void;
  authenticateToken: RequestHandler;
  validateUser: RequestHandler;
}

export type BookingService = (
  hotel_id: number,
  rooms: number,
  hotelSearchService: HotelRepo,
) => Acknowledgement | NotBookedError;
