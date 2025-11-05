import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// 获取新闻列表
router.get('/', async (req, res) => {
  try {
    const { category, limit = '20' } = req.query;
    const where: any = {};

    if (category) where.category = category;

    const news = await prisma.news.findMany({
      where,
      orderBy: { publishDate: 'desc' },
      take: parseInt(limit as string),
    });

    res.json(news);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// 获取新闻详情
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const news = await prisma.news.findUnique({
      where: { id: parseInt(id) },
    });

    if (!news) {
      return res.status(404).json({ error: 'News not found' });
    }

    // 增加浏览量
    await prisma.news.update({
      where: { id: parseInt(id) },
      data: { views: { increment: 1 } },
    });

    res.json(news);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

export default router;
