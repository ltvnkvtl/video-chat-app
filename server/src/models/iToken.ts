import { Document } from 'mongoose';
import { IUser } from './iUser';

export interface IToken extends Document {
    user: IUser['_id'];
    refreshToken: string;
}

export interface GeneratedTokens {
    accessToken: string;
    refreshToken: string;
}
