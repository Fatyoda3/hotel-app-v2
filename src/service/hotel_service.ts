import { type HotelRepo } from "../types/hotel_type.js";

export const searchHotel = (city: string, hotelSearchService: HotelRepo) => {
  if (typeof city !== "string" || city.trim() === "") {
    return { error: "The city query parameter is required.", hotels: [] };
  }

  const hotels = hotelSearchService.searchHotels(city);
  return { hotels };
};

export const searchHotelById = (
  hotel_id: number,
  hotelSearchService: HotelRepo,
) => {
  const hotel = hotelSearchService.searchHotelById(hotel_id);
  return hotel;
};
