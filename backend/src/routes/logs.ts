import express from 'express';
import { logService } from '../services/logService';

const router = express.Router();

// 获取日志列表
router.get('/', (req, res) => {
  try {
    const { level, source, limit, search } = req.query;

    const logs = logService.getLogs({
      level: level as any,
      source: source as string,
      limit: limit ? parseInt(limit as string) : undefined,
      search: search as string,
    });

    res.json({
      success: true,
      count: logs.length,
      logs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取日志失败',
      error: (error as Error).message,
    });
  }
});

// 获取日志统计
router.get('/stats', (req, res) => {
  try {
    const stats = logService.getStats();
    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取统计失败',
      error: (error as Error).message,
    });
  }
});

// 清除日志
router.delete('/', (req, res) => {
  try {
    logService.clear();
    res.json({
      success: true,
      message: '日志已清空',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '清空日志失败',
      error: (error as Error).message,
    });
  }
});

// 清理旧日志
router.post('/prune', (req, res) => {
  try {
    const { keepCount = 100 } = req.body;
    logService.prune(keepCount);
    res.json({
      success: true,
      message: `已清理旧日志，保留最近${keepCount}条`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '清理日志失败',
      error: (error as Error).message,
    });
  }
});

export default router;
