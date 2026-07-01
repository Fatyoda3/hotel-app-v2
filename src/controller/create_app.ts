import express, { type Express } from "express";
import { AppDependencies } from "../types/hotel_type.js";
import { createHotelSearchHandler } from "./create_hotel_search_handler.js";
import { createLoginHandler } from "./create_login_handler.js";

const loggerMiddleware = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  console.log(`${req.method} ${req.url} ${new Date().toISOString()}`);
  next();
};

export const createApp = (dependencies: AppDependencies): Express => {
  const app = express();
  app.use(express.json());
  app.use(loggerMiddleware);
  const hotelSearchHandler = createHotelSearchHandler(
    dependencies.hotelSearchService,
  );
  const loginHandler = createLoginHandler(dependencies.loginService);

  app.get("/api/search/hotels", hotelSearchHandler);
  app.post("/api/users/login", loginHandler);

  return app;
};
