import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

import matchRoutes from './routes/matches';
import teamRoutes from './routes/teams';
import playerRoutes from './routes/players';
import standingRoutes from './routes/standings';
import newsRoutes from './routes/news';
import syncRoutes from './routes/sync';
import logRoutes from './routes/logs';

import { startSyncScheduler } from './services/syncService';
import { logService } from './services/logService';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

export const prisma = new PrismaClient();

// 中间件
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 健康检查（放在路由之前，避免被其他中间件影响）
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 路由
app.use('/api/matches', matchRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/standings', standingRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/logs', logRoutes);

// 根路径
app.get('/', (req, res) => {
  res.json({
    message: 'Football App API',
    version: '1.0.0',
    endpoints: {
      matches: '/api/matches',
      teams: '/api/teams',
      players: '/api/players',
      standings: '/api/standings',
      news: '/api/news'
    }
  });
});

// 错误处理
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 启动服务器
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);

  // 记录启动日志
  logService.success('Server', `服务器启动成功，端口: ${port}`);
  logService.info('Server', `运行环境: ${process.env.NODE_ENV || 'development'}`);

  // 启动自动数据同步
  if (process.env.ENABLE_AUTO_SYNC === 'true') {
    console.log('🔄 Starting auto sync scheduler...');
    logService.info('Scheduler', '自动同步调度器已启动');
    startSyncScheduler();
  } else {
    logService.info('Scheduler', '自动同步已禁用，使用手动同步');
  }
});

// 优雅关闭
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
