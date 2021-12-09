import {User} from "./user.model";

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
