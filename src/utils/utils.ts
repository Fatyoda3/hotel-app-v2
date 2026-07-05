import bcrypt from "bcrypt";

export const parsePort = (port: string | undefined) => {
  const validPorts = [
    3000, 3001, 4000, 5000, 5173, 5500, 7000, 8000, 8080, 8081, 8088, 8888,
    9000, 9090, 9999, 10000, 12345, 30000, 49152, 50000, 55000, 60000, 65000,
    65535,
  ];
  const parsedPort = parseInt(port as string, 10);

  const isValidPort = validPorts.includes(parsedPort);
  if (isValidPort) {
    return parsedPort;
  }
  return !isNaN(parsedPort) ? parsedPort : 3000;
};

export const getJwtSecret = (secret: string | undefined): string => {
  return typeof secret === "string" && secret.length > 0
    ? secret
    : "fake-secret";
};
export const hasInvalidCredentials = (
  username: string,
  password: string,
): boolean => {
  return username.trim() === "" || password.trim() === "";
};
type EncryptFn = (password: string) => string;
type CompareFn = (password: string, hashed: string) => boolean;

export const passwordUtility = (encryptFn: EncryptFn, compareFn: CompareFn) => {
  return {
    encrypt: encryptFn,
    compare: compareFn,
  };
};
export type PasswordUtility = ReturnType<typeof passwordUtility>;
