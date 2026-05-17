import express from 'express';
import { forgotPassword, getMe, googleAuth, login, protectedRoute, register, resetPassword, sessionProtectedRoute } from '../controllers/authController.js';
import { loginValidator, newPasswordValidator, registerValidator } from '../validation/authValidation.js';
import passport from 'passport';
import { verifySessionId, verifyToken } from '../middlewares/authMiddleware.js';

const authRouter = express.Router();

authRouter.post('/register', registerValidator, register);

authRouter.post('/login', loginValidator, login);

authRouter.get('/getMe', verifyToken, getMe);


export default authRouter