import express, {
  type Express,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { AppDependencies } from "../types/hotel_type.js";
import { createHotelSearchHandler } from "./create_hotel_search_handler.js";
import { createLoginHandler } from "./create_login_handler.js";
import { createRegisterHandler } from "./create_register_handler.js";

const createLogger =
  (loggerUtility: (...data: any[]) => void) =>
  (req: Request, _res: Response, next: NextFunction) => {
    loggerUtility(`${req.method} ${req.url} ${new Date().toISOString()}`);
    next();
  };

export const createApp = (dependencies: AppDependencies): Express => {
  const app = express();
  app.use(express.json());

  const { hotelSearchService, loginService, registerService, loggerUtility } =
    dependencies;
  app.use(createLogger(loggerUtility));

  const hotelSearchHandler = createHotelSearchHandler(hotelSearchService);
  const loginHandler = createLoginHandler(loginService);
  const registerHandler = createRegisterHandler(registerService);

  app.get("/api/search/hotels", hotelSearchHandler);

  app.post("/api/users/login", loginHandler);
  app.post("/api/users/register", registerHandler);

  return app;
};
