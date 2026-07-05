import express, {
  type Express,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { AppDependencies, Middleware } from "../types/app_dependency_type.js";
import { createHotelSearchHandler } from "./create_hotel_search_handler.js";
import { createLoginHandler } from "./create_login_handler.js";
import { createRegisterHandler } from "./create_register_handler.js";
import { createBookingHandler } from "./create_booking_handler.js";

const createLogger =
  (loggerUtility: (...data: any[]) => void) =>
  (req: Request, _res: Response, next: NextFunction) => {
    loggerUtility(`${req.method} ${req.url} ${new Date().toISOString()}`);
    next();
  };

export const createApp = (
  dependencies: AppDependencies,
  middleware: Middleware,
): Express => {
  const app = express();
  app.use(express.json());

  const {
    hotelRepo: hotelSearchService,
    loginService,
    registerService,
    bookingService,
  } = dependencies;

  const { loggerUtility, authenticateToken, validateUser } = middleware;
  app.use(createLogger(loggerUtility));

  const hotelSearchHandler = createHotelSearchHandler(hotelSearchService);
  const loginHandler = createLoginHandler(loginService);
  const registerHandler = createRegisterHandler(registerService);
  const bookingHandler = createBookingHandler(
    hotelSearchService,
    bookingService,
  );

  app.get("/api/search/hotels", hotelSearchHandler);
  /* 
  what to do add zod validation for middleware on login and register handler route
  so I don't have to pollute the login or register
    */

  app.post("/api/users/login", validateUser, loginHandler);
  app.post("/api/users/register", validateUser, registerHandler);
  app.post("/api/bookings", authenticateToken, bookingHandler);

  return app;
};
