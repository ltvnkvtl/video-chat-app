import { Request } from 'express';
import { UserDto } from '../dto/UserDto';

export interface ExtendedRequest extends Request {
    user?: UserDto;
}
