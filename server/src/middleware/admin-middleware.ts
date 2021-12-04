import { ExtendedRequest } from '../models/extended-request';
import { NextFunction, Response } from 'express';
import ApiError from '../exceptions/ApiErrors';
import { RoleType } from '../models/iUser';

export const adminMiddleWare = (req: ExtendedRequest, res: Response, next: NextFunction) => {
    try {
        if (req.user!.role !== RoleType.ADMIN) {
            return next(ApiError.ForbiddenError('The user does not have permission to access'));
        }

        next();
    } catch (e) {
        return next(e);
    }
};
