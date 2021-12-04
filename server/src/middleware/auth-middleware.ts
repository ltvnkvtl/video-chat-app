import { NextFunction, Response } from 'express';
import ApiError from '../exceptions/ApiErrors';
import TokenService from '../services/TokenService';
import { ExtendedRequest } from '../models/extended-request';
import { UserDto } from '../dto/UserDto';

export const authMiddleWare = (req: ExtendedRequest, res: Response, next: NextFunction) => {
    try {
        const accessToken =
            req.body.token ||
            req.query.token ||
            req.headers['x-access-token'] ||
            (req.headers.authorization && req.headers.authorization.split(' ')[1]);

        if (!accessToken) {
            return next(ApiError.UnauthorizedError());
        }

        const userData = TokenService.validateAccessToken(accessToken);

        if (!userData) {
            return next(ApiError.UnauthorizedError());
        }

        req.user = userData as UserDto;

        next();
    } catch (e) {
        return next(ApiError.UnauthorizedError());
    }
};
