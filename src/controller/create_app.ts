import express, {
  type Express,
  type Request,
  type Response,
  type NextFunction,
  RequestHandler,
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

  const { hotelSearchService, loginService, registerService, bookingService } =
    dependencies;
  const { loggerUtility, authenticateToken } = middleware;
  app.use(createLogger(loggerUtility));

  const hotelSearchHandler = createHotelSearchHandler(hotelSearchService);
  const loginHandler = createLoginHandler(loginService);
  const registerHandler = createRegisterHandler(registerService);
  const bookingHandler = createBookingHandler(
    hotelSearchService,
    bookingService,
  );

  app.get("/api/search/hotels", hotelSearchHandler);

  app.post("/api/users/login", loginHandler);
  app.post("/api/users/register", registerHandler);
  /* protected endpoints */
  app.post("/api/bookings", authenticateToken, bookingHandler);
  return app;
};
