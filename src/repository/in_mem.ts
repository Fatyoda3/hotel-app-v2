import { Hotel, HotelSearchService } from "../types/hotel_type.js";

export class InMemoryHotelSearchService implements HotelSearchService {
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
}
