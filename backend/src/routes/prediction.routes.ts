import express from 'express';
import { prisma } from '../prisma';
import { authMiddleware, requireEmailVerification } from '../middleware/authMiddleware';
import { logService } from '../services/logService';

const router = express.Router();

/**
 * 创建预测 - 需要登录和邮箱验证
 */
router.post('/', authMiddleware, requireEmailVerification, async (req, res) => {
  try {
    const { matchId, predictedHomeScore, predictedAwayScore, predictedWinner } = req.body;
    const userId = (req as any).user.id;

    // 验证必填字段
    if (!matchId || predictedHomeScore == null || predictedAwayScore == null || !predictedWinner) {
      return res.status(400).json({ error: '缺少必填字段' });
    }

    // 检查比赛是否存在
    const match = await prisma.match.findUnique({
      where: { id: parseInt(matchId) },
    });

    if (!match) {
      return res.status(404).json({ error: '比赛不存在' });
    }

    // 检查比赛是否已开始
    if (match.status !== 'SCHEDULED' || new Date(match.matchDate) <= new Date()) {
      return res.status(400).json({ error: '比赛已开始或结束，无法预测' });
    }

    // 检查用户是否已经预测过这场比赛
    const existing = await prisma.prediction.findUnique({
      where: {
        userId_matchId: {
          userId,
          matchId: parseInt(matchId),
        },
      },
    });

    if (existing) {
      return res.status(400).json({ error: '您已经预测过这场比赛' });
    }

    // 创建预测
    const prediction = await prisma.prediction.create({
      data: {
        userId,
        matchId: parseInt(matchId),
        predictedHomeScore: parseInt(predictedHomeScore),
        predictedAwayScore: parseInt(predictedAwayScore),
        predictedWinner,
      },
      include: {
        match: {
          include: {
            homeTeam: true,
            awayTeam: true,
          },
        },
      },
    });

    logService.info('Prediction', `用户 ${userId} 创建预测: 比赛 ${matchId}`);

    res.json(prediction);
  } catch (error: any) {
    logService.error('Prediction', '创建预测失败', error);
    res.status(500).json({ error: error.message || '创建预测失败' });
  }
});

/**
 * 获取我的预测列表
 */
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { status } = req.query; // SCHEDULED, FINISHED

    const where: any = { userId };

    if (status) {
      where.match = { status };
    }

    const predictions = await prisma.prediction.findMany({
      where,
      include: {
        match: {
          include: {
            homeTeam: true,
            awayTeam: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(predictions);
  } catch (error: any) {
    logService.error('Prediction', '获取预测列表失败', error);
    res.status(500).json({ error: error.message || '获取预测列表失败' });
  }
});

/**
 * 获取单场比赛的预测统计
 */
router.get('/match/:matchId', async (req, res) => {
  try {
    const { matchId } = req.params;

    const predictions = await prisma.prediction.findMany({
      where: { matchId: parseInt(matchId) },
    });

    // 统计预测分布
    const stats = {
      total: predictions.length,
      homeWin: predictions.filter(p => p.predictedWinner === 'HOME').length,
      awayWin: predictions.filter(p => p.predictedWinner === 'AWAY').length,
      draw: predictions.filter(p => p.predictedWinner === 'DRAW').length,
    };

    res.json(stats);
  } catch (error: any) {
    logService.error('Prediction', '获取比赛预测统计失败', error);
    res.status(500).json({ error: error.message || '获取预测统计失败' });
  }
});

/**
 * 获取排行榜
 */
router.get('/leaderboard', async (req, res) => {
  try {
    const { limit = 100 } = req.query;

    const users = await prisma.user.findMany({
      where: {
        totalPoints: {
          gt: 0,
        },
      },
      select: {
        id: true,
        username: true,
        avatar: true,
        totalPoints: true,
        membershipTier: true,
      },
      orderBy: {
        totalPoints: 'desc',
      },
      take: parseInt(limit as string),
    });

    // 添加排名
    const leaderboard = users.map((user, index) => ({
      ...user,
      rank: index + 1,
    }));

    res.json(leaderboard);
  } catch (error: any) {
    logService.error('Prediction', '获取排行榜失败', error);
    res.status(500).json({ error: error.message || '获取排行榜失败' });
  }
});

/**
 * 获取用户的排行榜排名
 */
router.get('/my-rank', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        totalPoints: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    // 计算排名（有多少用户积分比我高）
    const rank = await prisma.user.count({
      where: {
        totalPoints: {
          gt: user.totalPoints,
        },
      },
    }) + 1;

    res.json({
      rank,
      totalPoints: user.totalPoints,
    });
  } catch (error: any) {
    logService.error('Prediction', '获取用户排名失败', error);
    res.status(500).json({ error: error.message || '获取排名失败' });
  }
});

/**
 * 计算比赛的预测积分（管理员功能 - 比赛结束后调用）
 */
router.post('/calculate/:matchId', async (req, res) => {
  try {
    const { matchId } = req.params;

    const match = await prisma.match.findUnique({
      where: { id: parseInt(matchId) },
    });

    if (!match) {
      return res.status(404).json({ error: '比赛不存在' });
    }

    if (match.status !== 'FINISHED' || match.homeScore == null || match.awayScore == null) {
      return res.status(400).json({ error: '比赛未结束或比分未确定' });
    }

    // 获取该比赛的所有预测
    const predictions = await prisma.prediction.findMany({
      where: { matchId: parseInt(matchId) },
    });

    const actualHomeScore = match.homeScore;
    const actualAwayScore = match.awayScore;
    let actualWinner = 'DRAW';
    if (actualHomeScore > actualAwayScore) actualWinner = 'HOME';
    if (actualHomeScore < actualAwayScore) actualWinner = 'AWAY';

    // 计算每个预测的积分
    for (const prediction of predictions) {
      let points = 0;
      let isCorrect = false;

      // 完全猜对比分：10分
      if (
        prediction.predictedHomeScore === actualHomeScore &&
        prediction.predictedAwayScore === actualAwayScore
      ) {
        points = 10;
        isCorrect = true;
      }
      // 猜对输赢和比分差：7分
      else if (
        prediction.predictedWinner === actualWinner &&
        prediction.predictedHomeScore - prediction.predictedAwayScore ===
          actualHomeScore - actualAwayScore
      ) {
        points = 7;
        isCorrect = true;
      }
      // 只猜对输赢：3分
      else if (prediction.predictedWinner === actualWinner) {
        points = 3;
        isCorrect = true;
      }

      // 更新预测记录
      await prisma.prediction.update({
        where: { id: prediction.id },
        data: {
          points,
          isCorrect,
        },
      });

      // 更新用户总积分
      await prisma.user.update({
        where: { id: prediction.userId },
        data: {
          totalPoints: {
            increment: points,
          },
        },
      });
    }

    logService.success('Prediction', `比赛 ${matchId} 的预测积分已计算，共 ${predictions.length} 个预测`);

    res.json({
      message: '积分计算完成',
      totalPredictions: predictions.length,
    });
  } catch (error: any) {
    logService.error('Prediction', '计算积分失败', error);
    res.status(500).json({ error: error.message || '计算积分失败' });
  }
});

export default router;
