import express from 'express';
import { prisma } from '../prisma';

const router = express.Router();

// 获取所有球队
router.get('/', async (req, res) => {
  try {
    const { country } = req.query;
    const where: any = {};

    if (country) where.country = country;

    const teams = await prisma.team.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

// 获取球队详情
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const team = await prisma.team.findUnique({
      where: { id: parseInt(id) },
      include: {
        players: true,
        standings: true,
        homeMatches: {
          take: 5,
          orderBy: { matchDate: 'desc' },
          include: { awayTeam: true },
        },
        awayMatches: {
          take: 5,
          orderBy: { matchDate: 'desc' },
          include: { homeTeam: true },
        },
      },
    });

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    res.json(team);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch team' });
  }
});

export default router;
