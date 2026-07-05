import {
  searchHotel,
  searchHotelById,
} from "../../src/service/hotel_service.js";
import { HotelSearchService, Hotel } from "../../src/types/hotel_type.js";
import { describe, it, expect, jest } from "@jest/globals";

describe("Hotel Service", () => {
  const mockHotelSearchService: jest.Mocked<HotelSearchService> = {
    searchHotels: jest.fn<HotelSearchService["searchHotels"]>(),
    searchHotelById: jest.fn<HotelSearchService["searchHotelById"]>(),
    createBooking: jest.fn<HotelSearchService["createBooking"]>(),
  };

  describe("searchHotel", () => {
    it("should return an error if the city query parameter is empty", () => {
      const result = searchHotel("   ", mockHotelSearchService);
      expect(result.error).toBe("The city query parameter is required.");
      expect(result.hotels).toEqual([]);
    });

    it("should call searchHotels on the injected service", () => {
      const mockHotel: Hotel = {
        id: 1,
        name: "Test",
        city: "Test",
        price: 100,
        rating: 5,
      };
      mockHotelSearchService.searchHotels.mockReturnValue([mockHotel]);

      const result = searchHotel("Test", mockHotelSearchService);
      expect(result.hotels).toHaveLength(1);
      expect(result.hotels[0]).toEqual(mockHotel);
    });
  });

  describe("searchHotelById", () => {
    it("should return the correct hotel requested by id", () => {
      const mockHotel: Hotel = {
        id: 1,
        name: "Test",
        city: "Test",
        price: 100,
        rating: 5,
      };
      mockHotelSearchService.searchHotelById.mockReturnValue(mockHotel);

      const result = searchHotelById(1, mockHotelSearchService);

      expect(result).toEqual(mockHotel);
      expect(mockHotelSearchService.searchHotelById).toHaveBeenCalledWith(1);
    });
  });
});
