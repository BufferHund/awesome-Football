import express, { Express } from 'express';
import routes from './routes';

// 创建并配置Express服务器
function createServer(): Express {
  const app = express();

  // 中间件
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // 日志中间件
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });

  // API路由
  app.use('/api', routes);

  // 健康检查端点
  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString()
    });
  });

  // 根路径
  app.get('/', (req, res) => {
    res.json({
      message: '欢迎使用足球数据API',
      endpoints: {
        teams: '/api/teams',
        players: '/api/players',
        matches: '/api/matches',
        stats: '/api/stats',
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
