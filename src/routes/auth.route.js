import express from 'express';
import {register, login, resendOtp, verifyEmail, updateProfile, getProfile} from '../controllers/auth.controller.js'
import {authMiddleware} from '../middlewares/auth.middleware.js';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/verify', verifyEmail);
authRouter.post('/resendotp', resendOtp);
authRouter.post('/update', authMiddleware, updateProfile);
authRouter.post('/', authMiddleware, getProfile);

export default authRouter;
