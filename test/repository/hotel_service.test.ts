import { InMemoryHotelRepo } from "../../src/repository/hotel_repository.js";
import { type Hotel } from "../../src/types/hotel_type.js";
import { describe, it, expect, beforeEach } from "@jest/globals";

describe("InMemoryHotelRepo", () => {
  const mockHotels: Hotel[] = [
    {
      id: 1,
      name: "Grand Central",
      city: "New York",
      price: 220,
      rating: 4.8,
      rooms: 10,
    },
    {
      id: 2,
      name: "Sunny Beach",
      city: "Miami",
      price: 260,
      rating: 4.7,
      rooms: 10,
    },
  ];

  let service: InMemoryHotelRepo;

  beforeEach(() => {
    service = new InMemoryHotelRepo(mockHotels);
  });

  it("should return hotels that match the city name", () => {
    const results = service.searchHotels("New York");
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe("Grand Central");
  });

  it("should be case-insensitive", () => {
    const results = service.searchHotels("miami");
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe("Sunny Beach");
  });

  it("should return an empty array if no hotels match", () => {
    const results = service.searchHotels("Chicago");
    expect(results).toHaveLength(0);
  });

  it("should return a hotel by its ID", () => {
    const result = service.searchHotelById(1);
    expect(result).toBeDefined();
    expect(result.name).toBe("Grand Central");
  });

  it("should return a booking acknowledgement with correct formatting", () => {
    const result = service.createBooking(1, 2);
    expect(result).toEqual({
      receiptId: "1   --- rooms2",
      message: "created booking",
    });
  });
});
