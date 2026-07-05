import { BookingService } from "../types/app_dependency_type.js";
import {
  Acknowledgement,
  hotelRepo,
  NotBookedError,
} from "../types/hotel_type.js";

export const bookingService: BookingService = (
  hotel_id: number,
  rooms: number,
  hotelSearchService: hotelRepo,
) => {
  const acknowledgement = hotelSearchService.createBooking(hotel_id, rooms);
  return acknowledgement;
};
