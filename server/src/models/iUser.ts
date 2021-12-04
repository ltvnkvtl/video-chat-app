import { Document } from 'mongoose';
import { UserDto } from '../dto/UserDto';

export interface IUser extends Document {
    email: string;
    password: string;
    role?: RoleType;
    name?: string;
}

export interface UserWithTokens {
    user: UserDto;
    accessToken: string;
    refreshToken: string;
}

export enum RoleType {
    ADMIN = 'admin',
    USER = 'user',
}
