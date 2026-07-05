import {
  Acknowledgement,
  Hotel,
  HotelRepo,
  NotBookedError,
} from "../types/hotel_type.js";

export class InMemoryHotelRepo implements HotelRepo {
  private readonly hotels: Hotel[];

  constructor(hotels: Hotel[]) {
    this.hotels = hotels;
  }

  public searchHotels(city: string): Hotel[] {
    const sanitizedCityName = city.trim().toLowerCase();

    return this.hotels.filter((hotel: Hotel) =>
      hotel.city.toLowerCase().includes(sanitizedCityName),
    );
  }

  public searchHotelById(hotel_id: number): Hotel {
    const hotel = this.hotels.find((hotel) => hotel.id === hotel_id)!;
    return hotel;
  }

  public createBooking(
    hotel_id: number,
    rooms: number,
  ): Acknowledgement | NotBookedError {
    const hotel = this.searchHotelById(hotel_id);
    if (hotel === undefined) {
      return {
        message: "Hotel not found",
      };
    }

    return {
      receiptId: "" + hotel_id + "   --- rooms" + rooms,
      message: "created booking",
    };
  }
}
