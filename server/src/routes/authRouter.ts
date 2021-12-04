import express from 'express';

import AuthController from '../controllers/AuthController';
import { body } from 'express-validator';
import { isUserRole } from '../helper-functions/helper-functions';

const authRouter = express.Router();

authRouter.post(
    '/registration',
    AuthController.registration,
);

authRouter.post(
    '/login',
    body('email').isEmail().withMessage('valid email is required'),
    body('password').exists({ checkFalsy: true }).withMessage('password is required'),
    AuthController.login,
);

authRouter.post('/logout', AuthController.logout);
authRouter.get('/refresh', AuthController.refresh);

export default authRouter;
