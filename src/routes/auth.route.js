import express from 'express';
import {register, login, resendOtp, verifyEmail, updateUser, getUser, adminLogin, adminGetUsers, adminGetUser, adminDeleteUser} from '../controllers/auth.controller.js'
import {authMiddleware, adminAuthMiddleware} from '../middlewares/auth.middleware.js';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/verify', verifyEmail);
authRouter.post('/resendotp', resendOtp);
authRouter.post('/update', authMiddleware, updateUser);
authRouter.get('/', authMiddleware, getUser);

authRouter.post('/admin/login', adminLogin)
authRouter.get('/admin/users', adminAuthMiddleware, adminGetUsers);
authRouter.post('/admin/user', adminAuthMiddleware, adminGetUser);
authRouter.delete('/admin/user', adminAuthMiddleware, adminDeleteUser);

export default authRouter;
