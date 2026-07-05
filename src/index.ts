import { createApp } from "./controller/create_app.js";
import {
  parsePort,
  getJwtSecret,
  passwordUtility as createPasswordUtility,
} from "./utils/utils.js";
import { InMemoryHotelSearchService } from "./repository/in_mem.js";
import { createInMemoryUserRepository } from "./repository/user_repository.js";
import { createLoginService } from "./service/login_service.js";
import { createRegisterService } from "./service/register_service.js";
import { hotels } from "./hotels.js";
import { bookingService } from "./service/booking_service.js";
import { createAuthenticateToken } from "./middleware/create_authenticate_token.js";
import bcrypt from "bcrypt";

const main = (): void => {
  const port = parsePort(process.env.PORT);
  const jwtSecret = getJwtSecret(process.env.JWT_SECRET);
  const authenticateToken = createAuthenticateToken(jwtSecret);

  const userRepository = createInMemoryUserRepository();
  const hotelSearchService = new InMemoryHotelSearchService(hotels);

  const passwordUtility = createPasswordUtility(
    (password) => bcrypt.hashSync(password, 2),
    bcrypt.compareSync,
  );

  const loginService = createLoginService(
    userRepository,
    jwtSecret,
    passwordUtility,
  );
  const registerService = createRegisterService(
    userRepository,
    passwordUtility,
  );

  const app = createApp(
    {
      hotelSearchService,
      loginService,
      registerService,
      bookingService,
    },
    {
      loggerUtility: console.log,
      authenticateToken,
    },
  );

  app.listen(port, () => {
    console.log(`Hotel API listening on port ${port}`);
  });
};

main();
