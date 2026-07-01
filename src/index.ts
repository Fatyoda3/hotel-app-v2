import { createApp } from "./controller/create_app.js";
import { InMemoryHotelSearchService } from "./repository/in_mem.js";
import { createInMemoryUserRepository } from "./repository/user_repository.js";
import { createLoginService } from "./service/login_service.js";
import { type Hotel } from "./types/hotel_type.js";

const parsePort = (port: string | undefined) => {
  return typeof port === "string" && port.length > 0 ? Number(port) : 3000;
};

const main = (): void => {
  const hotels: Hotel[] = [
    {
      id: "1",
      name: "Grand Central Hotel",
      city: "New York",
      price: 220,
      rating: 4.8,
    },
    {
      id: "2",
      name: "Harbor View Inn",
      city: "New York",
      price: 180,
      rating: 4.5,
    },
    {
      id: "3",
      name: "Sunny Beach Resort",
      city: "Miami",
      price: 260,
      rating: 4.7,
    },
  ];

  const port = parsePort(process.env.PORT);

  const userRepository = createInMemoryUserRepository();
  const loginService = createLoginService(userRepository);

  const app = createApp({
    hotelSearchService: new InMemoryHotelSearchService(hotels),
    loginService,
  });

  app.listen(port, () => {
    console.log(`Hotel API listening on port ${port}`);
  });
};

main();
