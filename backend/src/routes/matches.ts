import express from 'express';
import { prisma } from '../prisma';

const router = express.Router();

// 获取所有比赛
router.get('/', async (req, res) => {
  try {
    const { status, competition, date } = req.query;
    const where: any = {};

    if (status) where.status = status;
    if (competition) where.competition = competition;
    if (date) {
      const startDate = new Date(date as string);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      where.matchDate = { gte: startDate, lt: endDate };
    }

    const matches = await prisma.match.findMany({
      where,
      include: {
        homeTeam: true,
        awayTeam: true,
        events: true,
      },
      orderBy: { matchDate: 'desc' },
    });

    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

// 获取单个比赛详情
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const match = await prisma.match.findUnique({
      where: { id: parseInt(id) },
      include: {
        homeTeam: true,
        awayTeam: true,
        events: { orderBy: { minute: 'asc' } },
      },
    });

    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    res.json(match);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch match' });
  }
});

// 获取今日比赛
router.get('/today/list', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const matches = await prisma.match.findMany({
      where: {
        matchDate: {
          gte: today,
          lt: tomorrow,
        },
      },
      include: {
        homeTeam: true,
        awayTeam: true,
      },
      orderBy: { matchDate: 'asc' },
    });

    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch today matches' });
  }
});

// 获取直播中的比赛
router.get('/live/now', async (req, res) => {
  try {
    const matches = await prisma.match.findMany({
      where: { status: 'LIVE' },
      include: {
        homeTeam: true,
        awayTeam: true,
        events: true,
      },
      orderBy: { matchDate: 'asc' },
    });

    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch live matches' });
  }
});

export default router;
