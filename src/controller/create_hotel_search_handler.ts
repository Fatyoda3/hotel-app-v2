import { searchHotel } from "../service/hotel_service.js";
import { hotelRepo } from "../types/hotel_type.js";
import { type Request, type Response } from "express";

export const createHotelSearchHandler = (hotelSearchService: hotelRepo) => {
  return (request: Request, response: Response): void => {
    const city = request.query.city;
    const result = searchHotel(city as string, hotelSearchService);

    if (result.error !== undefined) {
      response.status(400).json({ error: result.error, hotels: [] });
      return;
    }
    response.status(200).json({ hotels: result.hotels });
  };
};
