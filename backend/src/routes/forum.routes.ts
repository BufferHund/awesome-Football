import { Router } from 'express';
import { prisma } from '../prisma';

const router = Router();

// 获取所有帖子（支持分页和筛选）
router.get('/posts', async (req, res) => {
  try {
    const {
      page = '1',
      limit = '20',
      category,
      sortBy = 'latest' // latest, hot, pinned
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'hot') {
      orderBy = { likes: 'desc' };
    } else if (sortBy === 'views') {
      orderBy = { views: 'desc' };
    }

    const where: any = {};
    if (category && category !== 'all') {
      where.category = category;
    }

    const [posts, total] = await Promise.all([
      prisma.forumPost.findMany({
        where,
        orderBy: [
          { isPinned: 'desc' }, // 置顶帖子优先
          orderBy
        ],
        skip,
        take: limitNum,
        include: {
          _count: {
            select: { comments: true }
          }
        }
      }),
      prisma.forumPost.count({ where })
    ]);

    res.json({
      data: posts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('获取帖子列表失败:', error);
    res.status(500).json({ error: '获取帖子列表失败' });
  }
});

// 获取单个帖子详情
router.get('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const post = await prisma.forumPost.findUnique({
      where: { id: parseInt(id) },
      include: {
        comments: {
          where: { parentId: null }, // 只获取顶级评论
          orderBy: { createdAt: 'desc' },
          include: {
            replies: {
              orderBy: { createdAt: 'asc' },
              take: 3 // 默认只显示3条回复
            }
          }
        }
      }
    });

    if (!post) {
      return res.status(404).json({ error: '帖子不存在' });
    }

    // 增加浏览数
    await prisma.forumPost.update({
      where: { id: parseInt(id) },
      data: { views: { increment: 1 } }
    });

    res.json(post);
  } catch (error) {
    console.error('获取帖子详情失败:', error);
    res.status(500).json({ error: '获取帖子详情失败' });
  }
});

// 创建新帖子
router.post('/posts', async (req, res) => {
  try {
    const { title, content, category, tags = [], images = [], author = '球迷用户', authorAvatar } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ error: '标题、内容和分类为必填项' });
    }

    const post = await prisma.forumPost.create({
      data: {
        title,
        content,
        category,
        tags,
        images,
        author,
        authorAvatar
      }
    });

    res.status(201).json(post);
  } catch (error) {
    console.error('创建帖子失败:', error);
    res.status(500).json({ error: '创建帖子失败' });
  }
});

// 点赞帖子
router.post('/posts/:id/like', async (req, res) => {
  try {
    const { id } = req.params;

    const post = await prisma.forumPost.update({
      where: { id: parseInt(id) },
      data: { likes: { increment: 1 } }
    });

    res.json(post);
  } catch (error) {
    console.error('点赞失败:', error);
    res.status(500).json({ error: '点赞失败' });
  }
});

// 获取帖子的所有评论
router.get('/posts/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = '1', limit = '20' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [comments, total] = await Promise.all([
      prisma.forumComment.findMany({
        where: {
          postId: parseInt(id),
          parentId: null // 只获取顶级评论
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
        include: {
          replies: {
            orderBy: { createdAt: 'asc' }
          }
        }
      }),
      prisma.forumComment.count({
        where: {
          postId: parseInt(id),
          parentId: null
        }
      })
    ]);

    res.json({
      data: comments,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('获取评论列表失败:', error);
    res.status(500).json({ error: '获取评论列表失败' });
  }
});

// 创建评论
router.post('/posts/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;
    const { content, author = '球迷用户', authorAvatar, parentId } = req.body;

    if (!content) {
      return res.status(400).json({ error: '评论内容不能为空' });
    }

    const comment = await prisma.forumComment.create({
      data: {
        postId: parseInt(id),
        content,
        author,
        authorAvatar,
        parentId: parentId ? parseInt(parentId) : null
      }
    });

    // 更新帖子的评论数
    await prisma.forumPost.update({
      where: { id: parseInt(id) },
      data: { commentsCount: { increment: 1 } }
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error('创建评论失败:', error);
    res.status(500).json({ error: '创建评论失败' });
  }
});

// 点赞评论
router.post('/comments/:id/like', async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await prisma.forumComment.update({
      where: { id: parseInt(id) },
      data: { likes: { increment: 1 } }
    });

    res.json(comment);
  } catch (error) {
    console.error('点赞评论失败:', error);
    res.status(500).json({ error: '点赞评论失败' });
  }
});

// 删除帖子（管理员功能）
router.delete('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.forumPost.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: '帖子已删除' });
  } catch (error) {
    console.error('删除帖子失败:', error);
    res.status(500).json({ error: '删除帖子失败' });
  }
});

// 删除评论
router.delete('/comments/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await prisma.forumComment.findUnique({
      where: { id: parseInt(id) }
    });

    if (!comment) {
      return res.status(404).json({ error: '评论不存在' });
    }

    await prisma.forumComment.delete({
      where: { id: parseInt(id) }
    });

    // 更新帖子的评论数
    await prisma.forumPost.update({
      where: { id: comment.postId },
      data: { commentsCount: { decrement: 1 } }
    });

    res.json({ message: '评论已删除' });
  } catch (error) {
    console.error('删除评论失败:', error);
    res.status(500).json({ error: '删除评论失败' });
  }
});

export default router;
