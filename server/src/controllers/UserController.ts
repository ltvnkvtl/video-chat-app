import { NextFunction, Request, Response } from 'express';
import UserService from '../services/UserService';
import { validationResult } from 'express-validator';
import ApiError from '../exceptions/ApiErrors';

class UserController {
    async getAllUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await UserService.getAllUsers();

            return res.json(users);
        } catch (e) {
            next(e);
        }
    }

    async getUserById(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Validation error', errors.array()));
            }

            const user = await UserService.getUserById(req.params.id);

            return res.json(user);
        } catch (e) {
            next(e);
        }
    }

    async updateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Validation error', errors.array()));
            }

            let user = req.body;

            const updatedUser = await UserService.updateUser(user);

            return res.json(updatedUser);
        } catch (e) {
            next(e);
        }
    }

    async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Validation error', errors.array()));
            }

            const deletedUser = await UserService.deleteUser(req.params.id);

            return res.json(deletedUser);
        } catch (e) {
            next(e);
        }
    }
}

export default new UserController();
