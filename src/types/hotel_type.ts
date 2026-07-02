import { type LoginService, type RegisterService } from "./user_type.js";

export interface Hotel {
  id: string;
  name: string;
  city: string;
  price: number;
  rating: number;
}

export interface HotelSearchService {
  searchHotels(city: string): Hotel[];
}

export interface AppDependencies {
  hotelSearchService: HotelSearchService;
  loginService: LoginService;
  registerService: RegisterService;
  loggerUtility: (message: string) => void;
}
