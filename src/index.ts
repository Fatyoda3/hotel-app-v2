import { createApp } from "./controller/create_app.js";

import bcrypt from "bcrypt";

import { parsePort, parseSecret, createPassUtility } from "./utils/utils.js";
import { InMemoryHotelRepo } from "./repository/hotel_repository.js";
import { createInMemoryUserRepository } from "./repository/user_repository.js";
import { createLoginService } from "./service/login_service.js";
import { createRegisterService } from "./service/register_service.js";
import { hotels } from "./hotels.js";
import { bookingService } from "./service/booking_service.js";
import { createAuthenticateToken } from "./middleware/create_authenticate_token.js";
import { createValidateUser } from "./middleware/create_validate_user.js";

const main = (): void => {
  const port = parsePort(process.env.PORT);
  const jwtSecret = parseSecret(process.env.JWT_SECRET);
  const authenticateToken = createAuthenticateToken(jwtSecret);

  const userRepository = createInMemoryUserRepository();
  const hotelRepo = new InMemoryHotelRepo(hotels);

  const passwordUtility = createPassUtility(
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

  const validateUser = createValidateUser();

  const app = createApp(
    {
      hotelRepo,
      loginService,
      registerService,
      bookingService,
    },
    {
      loggerUtility: console.log,
      authenticateToken,
      validateUser,
    },
  );

  app.listen(port, () => {
    console.log(`Hotel API listening on port ${port}`);
  });
};

main();
