import { HotelSearchService } from "../types/hotel_type.js";
import { type Request, type Response } from "express";

export const createHotelSearchHandler = (
  hotelSearchService: HotelSearchService,
) => {
  return (request: Request, response: Response): void => {
    const city = request.query.city;

    if (typeof city !== "string" || city.trim() === "") {
      response
        .status(400)
        .json({ error: "The city query parameter is required." });
      return;
    }

    const hotels = hotelSearchService.searchHotels(city);
    response.status(200).json({ hotels });
  };
};
