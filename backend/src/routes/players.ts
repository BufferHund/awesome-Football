import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// 获取所有球员
router.get('/', async (req, res) => {
  try {
    const { teamId, position } = req.query;
    const where: any = {};

    if (teamId) where.teamId = parseInt(teamId as string);
    if (position) where.position = position;

    const players = await prisma.player.findMany({
      where,
      include: { team: true },
      orderBy: { name: 'asc' },
    });

    res.json(players);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch players' });
  }
});

// 获取球员详情
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const player = await prisma.player.findUnique({
      where: { id: parseInt(id) },
      include: { team: true },
    });

    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    res.json(player);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch player' });
  }
});

export default router;
