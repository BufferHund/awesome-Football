import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';
import { logService } from '../services/logService';

// 扩展Express Request类型以包含user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
      };
    }
  }
}

/**
 * JWT认证中间件
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: '未提供认证令牌' });
    }

    const token = authHeader.substring(7); // 移除 "Bearer " 前缀

    // 验证token
    const decoded = authService.verifyToken(token);

    // 将用户信息添加到请求对象
    req.user = decoded;

    next();
  } catch (error) {
    logService.error('AuthMiddleware', '认证失败', error);
    return res.status(401).json({ error: '认证失败' });
  }
};

/**
 * 检查邮箱是否已验证
 */
export const requireEmailVerification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: '未认证' });
    }

    const user = await authService.getUserById(req.user.userId);

    if (!user.emailVerified) {
      return res.status(403).json({
        error: '需要验证邮箱',
        message: '请先验证您的邮箱才能使用此功能'
      });
    }

    next();
  } catch (error) {
    logService.error('AuthMiddleware', '邮箱验证检查失败', error);
    return res.status(500).json({ error: '服务器错误' });
  }
};

/**
 * 检查是否有会员权限
 */
export const requireMembership = (minTier: 'FREE' | 'BASIC' | 'PRO' | 'ULTIMATE' = 'BASIC') => {
  const tierLevels = {
    'FREE': 0,
    'BASIC': 1,
    'PRO': 2,
    'ULTIMATE': 3,
  };

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: '未认证' });
      }

      const user = await authService.getUserById(req.user.userId);

      // 检查会员等级
      const userTierLevel = tierLevels[user.membershipTier as keyof typeof tierLevels] || 0;
      const requiredTierLevel = tierLevels[minTier];

      if (userTierLevel < requiredTierLevel) {
        return res.status(403).json({
          error: '权限不足',
          message: `此功能需要 ${minTier} 或更高级别的会员`
        });
      }

      // 检查会员是否过期
      if (user.membershipExpiresAt && user.membershipExpiresAt < new Date()) {
        return res.status(403).json({
          error: '会员已过期',
          message: '您的会员已过期，请续费'
        });
      }

      next();
    } catch (error) {
      logService.error('AuthMiddleware', '会员检查失败', error);
      return res.status(500).json({ error: '服务器错误' });
    }
  };
};
