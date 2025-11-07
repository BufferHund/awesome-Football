import express, { Request, Response } from 'express';
import { superAuthClient } from './superAuthClient';
import { optionalAuth } from './middleware';

const router = express.Router();

/**
 * 用户登录 (Direct API模式)
 * POST /api/auth/login
 */
router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📝 [登录请求] Direct API模式');
  console.log(`   用户名: ${username}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // 验证必填字段
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: '用户名和密码不能为空'
    });
  }

  try {
    // 调用SuperAuth Gateway登录
    const loginResult = await superAuthClient.login(username, password);

    // 如果登录成功，转发Set-Cookie头
    if (loginResult.success && loginResult.setCookie) {
      console.log('✅ [登录成功] 设置Cookie');
      res.setHeader('Set-Cookie', loginResult.setCookie);
    }

    // 返回登录结果
    const statusCode = loginResult.success ? 200 : 401;
    res.status(statusCode).json({
      success: loginResult.success,
      message: loginResult.message,
      user: loginResult.user
    });
  } catch (error: any) {
    console.error('❌ [登录失败]', error.message);
    res.status(500).json({
      success: false,
      message: '登录服务暂时不可用'
    });
  }
});

/**
 * 用户注册 (Direct API模式)
 * POST /api/auth/register
 */
router.post('/register', async (req: Request, res: Response) => {
  const { username, email, password, passwordConfirm } = req.body;

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📝 [注册请求] Direct API模式');
  console.log(`   用户名: ${username}`);
  console.log(`   邮箱: ${email}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // 验证必填字段
  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: '用户名、邮箱和密码不能为空'
    });
  }

  // 验证用户名格式
  if (username.length < 3 || username.length > 20) {
    return res.status(400).json({
      success: false,
      message: '用户名长度必须在3-20个字符之间'
    });
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return res.status(400).json({
      success: false,
      message: '用户名只能包含字母、数字和下划线'
    });
  }

  // 验证邮箱格式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: '邮箱格式不正确'
    });
  }

  // 验证密码长度
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: '密码长度至少6个字符'
    });
  }

  // 验证密码确认（如果提供）
  if (passwordConfirm && password !== passwordConfirm) {
    return res.status(400).json({
      success: false,
      message: '两次输入的密码不一致'
    });
  }

  try {
    // 调用SuperAuth Gateway注册
    const registerResult = await superAuthClient.register(username, email, password);

    // 如果注册成功，转发Set-Cookie头（自动登录）
    if (registerResult.success && registerResult.setCookie) {
      console.log('✅ [注册成功] 自动登录，设置Cookie');
      res.setHeader('Set-Cookie', registerResult.setCookie);
    }

    // 返回注册结果
    const statusCode = registerResult.success ? 201 : 400;
    res.status(statusCode).json({
      success: registerResult.success,
      message: registerResult.message,
      user: registerResult.user
    });
  } catch (error: any) {
    console.error('❌ [注册失败]', error.message);
    res.status(500).json({
      success: false,
      message: '注册服务暂时不可用'
    });
  }
});

/**
 * 用户登出
 * POST /api/auth/logout
 */
router.post('/logout', async (req: Request, res: Response) => {
  const token = req.cookies.auth_token;

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🚪 [登出请求]');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (!token) {
    return res.status(400).json({
      success: false,
      message: '未找到认证信息'
    });
  }

  try {
    // 调用SuperAuth Gateway登出
    const logoutResult = await superAuthClient.logout(token);

    // 清除Cookie
    res.clearCookie('auth_token');

    res.json(logoutResult);
  } catch (error: any) {
    console.error('❌ [登出失败]', error.message);
    res.status(500).json({
      success: false,
      message: '登出失败'
    });
  }
});

/**
 * 获取当前登录用户信息
 * GET /api/auth/me
 */
router.get('/me', optionalAuth, async (req: Request, res: Response) => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('👤 [获取用户信息]');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (!req.user) {
    return res.json({
      success: false,
      authenticated: false,
      message: '未登录'
    });
  }

  res.json({
    success: true,
    authenticated: true,
    user: req.user
  });
});

/**
 * Portal重定向登录 (Portal模式)
 * GET /api/auth/portal-login
 *
 * 返回Portal登录URL，前端可以重定向到此URL
 */
router.get('/portal-login', (req: Request, res: Response) => {
  const appUrl = `${req.protocol}://${req.get('host')}`;
  const returnUrl = req.query.return || `${appUrl}/`;
  const portalLoginUrl = superAuthClient.getPortalLoginUrl(returnUrl as string);

  res.json({
    success: true,
    portalUrl: portalLoginUrl,
    message: '请前往Portal登录'
  });
});

/**
 * Portal重定向注册 (Portal模式)
 * GET /api/auth/portal-register
 */
router.get('/portal-register', (req: Request, res: Response) => {
  const appUrl = `${req.protocol}://${req.get('host')}`;
  const returnUrl = req.query.return || `${appUrl}/`;
  const portalRegisterUrl = superAuthClient.getPortalRegisterUrl(returnUrl as string);

  res.json({
    success: true,
    portalUrl: portalRegisterUrl,
    message: '请前往Portal注册'
  });
});

export default router;
