import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// 获取积分榜
router.get('/', async (req, res) => {
  try {
    const { competition } = req.query;

    if (!competition) {
      return res.status(400).json({ error: 'Competition parameter is required' });
    }

    const standings = await prisma.standing.findMany({
      where: { competition: competition as string },
      include: { team: true },
      orderBy: [
        { points: 'desc' },
        { goalDiff: 'desc' },
        { goalsFor: 'desc' },
      ],
    });

    res.json(standings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch standings' });
  }
});

// 获取所有可用的联赛
router.get('/competitions/list', async (req, res) => {
  try {
    const competitions = await prisma.standing.findMany({
      distinct: ['competition'],
      select: { competition: true },
    });

    res.json(competitions.map(c => c.competition));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch competitions' });
  }
});

export default router;
