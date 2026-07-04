import { createApp } from "./controller/create_app.js";
import { parsePort, getJwtSecret } from "./utils/utils.js";
import { InMemoryHotelSearchService } from "./repository/in_mem.js";
import { createInMemoryUserRepository } from "./repository/user_repository.js";
import { createLoginService } from "./service/login_service.js";
import { createRegisterService } from "./service/register_service.js";
import { hotels } from "./hotels.js";

const main = (): void => {
  const port = parsePort(process.env.PORT);
  const jwtSecret = getJwtSecret(process.env.JWT_SECRET);

  const userRepository = createInMemoryUserRepository();
  const loginService = createLoginService(userRepository, jwtSecret);
  const hotelSearchService = new InMemoryHotelSearchService(hotels);
  const registerService = createRegisterService(userRepository);

  const app = createApp({
    hotelSearchService,
    loginService,
    registerService,
    loggerUtility: console.log,
  });

  app.listen(port, () => {
    console.log(`Hotel API listening on port ${port}`);
  });
};

main();
