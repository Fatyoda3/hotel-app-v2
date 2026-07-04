export interface User {
  id: string;
  username: string;
  password: string;
}

export interface PublicUser {
  id: string;
  username: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResult {
  success: boolean;
  message: string;
  token?: string;
  user?: PublicUser;
}

export interface LoginService {
  login(request: LoginRequest): LoginResult;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface RegisterResult {
  success: boolean;
  message: string;
  user?: PublicUser;
}

export interface RegisterService {
  register(request: RegisterRequest): RegisterResult;
}

export interface UserRepo {
  findUserByUsername(username: string): User | undefined;
  saveUser(user: User): void;
}
