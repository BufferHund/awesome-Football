import express from 'express';
import { authController } from '../controllers/authController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

// 公开路由（不需要认证）
router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.get('/verify-email/:token', (req, res) => authController.verifyEmail(req, res));
router.post('/resend-verification', (req, res) => authController.resendVerification(req, res));

// 需要认证的路由
router.post('/logout', authenticate, (req, res) => authController.logout(req, res));
router.delete('/account', authenticate, (req, res) => authController.deleteAccount(req, res));
router.get('/me', authenticate, (req, res) => authController.getCurrentUser(req, res));
router.put('/avatar', authenticate, (req, res) => authController.updateAvatar(req, res));

export default router;
