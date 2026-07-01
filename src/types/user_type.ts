export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResult {
  success: boolean;
  message: string;
  user?: User;
}

export interface LoginService {
  login(request: LoginRequest): LoginResult;
}

export interface UserRepository {
  findUserByEmail(email: string): User | undefined;
}
