export interface Acknowledgement {
  receiptId: string;
  message: string;
}

export interface NotBookedError {
  message: string;
}

export interface Hotel {
  id: number;
  name: string;
  city: string;
  price: number;
  rating: number;
  rooms: number;
}

export interface hotelRepo {
  searchHotels(city: string): Hotel[];
  searchHotelById(hotel_id: number): Hotel;
  createBooking(
    hotel_id: number,
    rooms: number,
  ): Acknowledgement | NotBookedError;
}
