import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { logService } from '../services/logService';

export class AuthController {
  /**
   * 用户注册
   * POST /api/auth/register
   */
  async register(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;

      // 验证输入
      if (!username || !email || !password) {
        return res.status(400).json({ error: '请提供用户名、邮箱和密码' });
      }

      // 验证邮箱格式
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: '邮箱格式不正确' });
      }

      // 验证用户名长度
      if (username.length < 3 || username.length > 20) {
        return res.status(400).json({ error: '用户名长度应在3-20个字符之间' });
      }

      // 验证密码长度
      if (password.length < 6) {
        return res.status(400).json({ error: '密码长度至少为6个字符' });
      }

      const result = await authService.register({ username, email, password });

      res.status(201).json({
        message: '注册成功',
        data: result,
      });
    } catch (error: any) {
      logService.error('AuthController', '注册失败', error);
      res.status(400).json({ error: error.message || '注册失败' });
    }
  }

  /**
   * 用户登录
   * POST /api/auth/login
   */
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // 验证输入
      if (!email || !password) {
        return res.status(400).json({ error: '请提供邮箱和密码' });
      }

      const result = await authService.login({ email, password });

      res.json({
        message: '登录成功',
        data: result,
      });
    } catch (error: any) {
      logService.error('AuthController', '登录失败', error);
      res.status(401).json({ error: error.message || '登录失败' });
    }
  }

  /**
   * 验证邮箱
   * GET /api/auth/verify-email/:token
   */
  async verifyEmail(req: Request, res: Response) {
    try {
      const { token } = req.params;

      await authService.verifyEmail(token);

      res.json({ message: '邮箱验证成功' });
    } catch (error: any) {
      logService.error('AuthController', '邮箱验证失败', error);
      res.status(400).json({ error: error.message || '邮箱验证失败' });
    }
  }

  /**
   * 重新发送验证邮件
   * POST /api/auth/resend-verification
   */
  async resendVerification(req: Request, res: Response) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: '请提供邮箱' });
      }

      const token = await authService.resendVerification(email);

      res.json({
        message: '验证邮件已发送',
        verificationToken: token, // 开发环境返回token，生产环境应该通过邮件发送
      });
    } catch (error: any) {
      logService.error('AuthController', '重新发送验证邮件失败', error);
      res.status(400).json({ error: error.message || '重新发送验证邮件失败' });
    }
  }

  /**
   * 用户注销
   * POST /api/auth/logout
   */
  async logout(req: Request, res: Response) {
    try {
      if (req.user) {
        await authService.logout(req.user.userId);
      }

      res.json({ message: '注销成功' });
    } catch (error: any) {
      logService.error('AuthController', '注销失败', error);
      res.status(500).json({ error: '注销失败' });
    }
  }

  /**
   * 删除账户
   * DELETE /api/auth/account
   */
  async deleteAccount(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: '未认证' });
      }

      const { password } = req.body;

      if (!password) {
        return res.status(400).json({ error: '请提供密码' });
      }

      await authService.deleteAccount(req.user.userId, password);

      res.json({ message: '账户已删除' });
    } catch (error: any) {
      logService.error('AuthController', '删除账户失败', error);
      res.status(400).json({ error: error.message || '删除账户失败' });
    }
  }

  /**
   * 获取当前用户信息
   * GET /api/auth/me
   */
  async getCurrentUser(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: '未认证' });
      }

      const user = await authService.getUserById(req.user.userId);

      res.json({ data: user });
    } catch (error: any) {
      logService.error('AuthController', '获取用户信息失败', error);
      res.status(500).json({ error: '获取用户信息失败' });
    }
  }

  /**
   * 更新用户头像
   * PUT /api/auth/avatar
   */
  async updateAvatar(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: '未认证' });
      }

      const { avatarUrl } = req.body;

      if (!avatarUrl) {
        return res.status(400).json({ error: '请提供头像URL' });
      }

      const user = await authService.updateAvatar(req.user.userId, avatarUrl);

      res.json({
        message: '头像更新成功',
        data: user,
      });
    } catch (error: any) {
      logService.error('AuthController', '更新头像失败', error);
      res.status(500).json({ error: '更新头像失败' });
    }
  }
}

export const authController = new AuthController();
