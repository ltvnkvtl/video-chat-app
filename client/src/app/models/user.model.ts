export interface User {
  id: string,
  email: string,
  role?: RoleType,
  name?: string
}

export interface UserWithTokens {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export enum RoleType {
  ADMIN = 'admin',
  USER = 'user',
}
