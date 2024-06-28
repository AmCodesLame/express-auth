import express from 'express';
import {register, login, resendOtp, verifyEmail} from '../controllers/auth.controller.js'

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/verify', verifyEmail);
authRouter.post('/resendotp', resendOtp);

export default authRouter;
