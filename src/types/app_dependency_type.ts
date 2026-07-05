import { RequestHandler } from "express";
import { Acknowledgement, hotelRepo, NotBookedError } from "./hotel_type.js";
import type { LoginService, RegisterService } from "./user_type.js";

export interface AppDependencies {
  hotelSearchService: hotelRepo;
  loginService: LoginService;
  registerService: RegisterService;
  bookingService: BookingService;
}

export interface Middleware {
  loggerUtility: (message: string) => void;
  authenticateToken: RequestHandler;
}

export type BookingService = (
  hotel_id: number,
  rooms: number,
  hotelSearchService: hotelRepo,
) => Acknowledgement | NotBookedError;
