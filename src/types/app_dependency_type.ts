import { RequestHandler } from "express";
import {
  Acknowledgement,
  HotelSearchService,
  NotBookedError,
} from "./hotel_type.js";
import type { LoginService, RegisterService } from "./user_type.js";

export interface AppDependencies {
  hotelSearchService: HotelSearchService;
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
  hotelSearchService: HotelSearchService,
) => Acknowledgement | NotBookedError;
