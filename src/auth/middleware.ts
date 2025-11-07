import { Request, Response, NextFunction } from 'express';
import { superAuthClient } from './superAuthClient';

// 扩展Express Request类型以包含user属性
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

/**
 * 认证中间件 - 验证用户是否已登录
 * 支持两种模式：
 * 1. requireAuth: 要求真实用户登录（默认）
 * 2. requireAuth({ allowVirtual: true }): 允许虚拟用户访问
 */
export function requireAuth(options: { allowVirtual?: boolean; redirectMode?: 'api' | 'portal' } = {}) {
  const { allowVirtual = false, redirectMode = 'api' } = options;

  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.auth_token;

    console.log(`[认证中间件] 检查认证: ${req.method} ${req.path}`);

    // 没有Token
    if (!token) {
      console.log('[认证中间件] 未找到Token');

      if (redirectMode === 'portal') {
        // Portal模式：重定向到Portal登录页
        const appUrl = `${req.protocol}://${req.get('host')}`;
        const currentUrl = `${appUrl}${req.originalUrl}`;
        const portalLoginUrl = superAuthClient.getPortalLoginUrl(currentUrl);

        console.log(`[认证中间件] 重定向到Portal: ${portalLoginUrl}`);
        return res.redirect(portalLoginUrl);
      } else {
        // API模式：返回401错误
        return res.status(401).json({
          success: false,
          message: '请先登录',
          authRequired: true
        });
      }
    }

    // 验证Token
    try {
      const verifyResult = await superAuthClient.verifyToken(token);

      if (!verifyResult.success || !verifyResult.user) {
        console.log('[认证中间件] Token验证失败');

        if (redirectMode === 'portal') {
          // Portal模式：重定向到Portal登录页
          const appUrl = `${req.protocol}://${req.get('host')}`;
          const currentUrl = `${appUrl}${req.originalUrl}`;
          const portalLoginUrl = superAuthClient.getPortalLoginUrl(currentUrl);
          return res.redirect(portalLoginUrl);
        } else {
          // API模式：返回401错误
          return res.status(401).json({
            success: false,
            message: '认证已过期，请重新登录',
            authRequired: true
          });
        }
      }

      const user = verifyResult.user;

      // 检查是否是虚拟用户
      if (user.isVirtual && !allowVirtual) {
        console.log('[认证中间件] 虚拟用户被拒绝');

        if (redirectMode === 'portal') {
          // Portal模式：重定向到Portal登录页
          const appUrl = `${req.protocol}://${req.get('host')}`;
          const currentUrl = `${appUrl}${req.originalUrl}`;
          const portalLoginUrl = superAuthClient.getPortalLoginUrl(currentUrl);
          return res.redirect(portalLoginUrl);
        } else {
          // API模式：返回403错误
          return res.status(403).json({
            success: false,
            message: '需要真实用户登录',
            isVirtual: true,
            authRequired: true
          });
        }
      }

      // 认证成功，将用户信息附加到请求对象
      req.user = user;
      console.log(`[认证中间件] 认证成功: ${user.username} (${user.isVirtual ? '虚拟用户' : '真实用户'})`);
      next();
    } catch (error: any) {
      console.error('[认证中间件] 验证Token时出错:', error.message);

      return res.status(500).json({
        success: false,
        message: '认证服务暂时不可用'
      });
    }
  };
}

/**
 * 可选认证中间件 - 如果有Token则验证，没有则跳过
 * 用于可选登录的页面
 */
export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.auth_token;

  if (!token) {
    // 没有Token，继续但不设置user
    return next();
  }

  try {
    const verifyResult = await superAuthClient.verifyToken(token);

    if (verifyResult.success && verifyResult.user) {
      req.user = verifyResult.user;
      console.log(`[可选认证] 已登录用户: ${req.user.username}`);
    }
  } catch (error) {
    // 验证失败，但不阻止请求
    console.error('[可选认证] Token验证失败，继续处理请求');
  }

  next();
}
