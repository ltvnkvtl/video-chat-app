import express from 'express';

import UserController from '../controllers/UserController';
import { body, param } from 'express-validator';
import { authMiddleWare } from '../middleware/auth-middleware';
import { isUserRole } from '../helper-functions/helper-functions';
import { adminMiddleWare } from '../middleware/admin-middleware';

const userRouter = express.Router();

userRouter.get('/users', authMiddleWare, UserController.getAllUsers);
userRouter.get('/users/:id', authMiddleWare, param('id').isMongoId(), UserController.getUserById);

userRouter.put(
    '/users',
    authMiddleWare,
    body('id').isMongoId(),
    body('email').optional().isEmail(),
    body('password').optional().isLength({ min: 5, max: 16 }),
    body('name').optional().isString(),
    body('role').optional().custom(isUserRole).withMessage('role must be "admin" or "user"'),
    UserController.updateUser,
);

userRouter.delete('/users/:id', authMiddleWare, adminMiddleWare, param('id').isMongoId(), UserController.deleteUser);

export default userRouter;
