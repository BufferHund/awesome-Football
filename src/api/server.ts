import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import routes from './routes';
import authRoutes from '../auth/authRoutes';

// 创建并配置Express服务器
function createServer(): Express {
  const app = express();

  // 中间件
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // 日志中间件
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });

  // 静态文件服务（前端页面）
  app.use(express.static('public'));

  // 认证API路由
  app.use('/api/auth', authRoutes);

  // 业务API路由
  app.use('/api', routes);

  // 健康检查端点
  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString()
    });
  });

  // 根路径
  app.get('/api', (req, res) => {
    res.json({
      message: '欢迎使用足球数据API',
      endpoints: {
        auth: {
          login: 'POST /api/auth/login',
          register: 'POST /api/auth/register',
          logout: 'POST /api/auth/logout',
          me: 'GET /api/auth/me',
          portalLogin: 'GET /api/auth/portal-login',
          portalRegister: 'GET /api/auth/portal-register'
        },
        data: {
          teams: '/api/teams',
          players: '/api/players',
          matches: '/api/matches',
          products: '/api/products',
          users: '/api/users',
          bets: '/api/bets'
        },
        health: '/health'
      }
    });
  });

  // 404处理
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: '端点不存在'
    });
  });

  return app;
}

export default createServer;
