// hotel search, availability of room,
// take hotel_id ,rooms
// return acknowledgement with receipt_id

import { bookingService } from "../service/booking_service.js";
import { searchHotel } from "../service/hotel_service.js";
import { BookingService } from "../types/app_dependency_type.js";
import {
  Acknowledgement,
  HotelRepo,
  NotBookedError,
} from "../types/hotel_type.js";
import { type Request, type Response } from "express";
// createBookingHandler(hotelSearchService) -> bookingHandler->
/* 
booking handler will search hotel against id 
and check availability 
if available 
return created booking and trigger update for room availability
if not available
return failed to create 

booking needs to lookup created user and then follow 
through 
I have to add a middleware which will parse and attach the 
json parsed token
*/
export const createBookingHandler = (
  hotelSearchService: HotelRepo,
  bookingService: BookingService,
) => {
  return (request: Request, response: Response): void => {
    const { hotel_id, rooms } = request.body;
    const acknowledgement = bookingService(hotel_id, rooms, hotelSearchService);
    response.json({ acknowledgement }).status(200);
    return;
  };
};
