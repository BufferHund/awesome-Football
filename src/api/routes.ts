import express, { Request, Response } from 'express';
import Database from '../database/db';
import { Team, Player, Match, Product, User } from '../models/types';
import BettingService from '../services/bettingService';

const router = express.Router();
const db = Database.getInstance();
const bettingService = new BettingService();

// ========== 球队相关API ==========

// 获取所有球队
router.get('/teams', async (req: Request, res: Response) => {
  try {
    const teams = await db.getAllTeams();
    res.json({
      success: true,
      count: teams.length,
      data: teams
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取球队数据失败'
    });
  }
});

// 根据ID获取球队
router.get('/teams/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const team = await db.getTeamById(id);

    if (!team) {
      return res.status(404).json({
        success: false,
        error: '球队不存在'
      });
    }

    res.json({
      success: true,
      data: team
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取球队数据失败'
    });
  }
});

// 创建新球队（并持久化到数据库）
router.post('/teams', async (req: Request, res: Response) => {
  try {
    const team: Omit<Team, 'id'> = req.body;

    // 验证必填字段
    if (!team.name || !team.country) {
      return res.status(400).json({
        success: false,
        error: '缺少必填字段: name, country'
      });
    }

    // 保存到数据库
    const teamId = await db.saveTeam(team);

    res.status(201).json({
      success: true,
      message: '球队创建成功并已保存到数据库',
      data: {
        id: teamId,
        ...team
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '创建球队失败'
    });
  }
});

// ========== 球员相关API ==========

// 获取所有球员
router.get('/players', async (req: Request, res: Response) => {
  try {
    const players = await db.getAllPlayers();
    res.json({
      success: true,
      count: players.length,
      data: players
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取球员数据失败'
    });
  }
});

// 根据球队ID获取球员
router.get('/players/team/:teamId', async (req: Request, res: Response) => {
  try {
    const teamId = parseInt(req.params.teamId);
    const players = await db.getPlayersByTeamId(teamId);

    res.json({
      success: true,
      count: players.length,
      data: players
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取球员数据失败'
    });
  }
});

// 创建新球员（并持久化到数据库）
router.post('/players', async (req: Request, res: Response) => {
  try {
    const player: Omit<Player, 'id'> = req.body;

    // 验证必填字段
    if (!player.name || !player.teamId || !player.position) {
      return res.status(400).json({
        success: false,
        error: '缺少必填字段: name, teamId, position'
      });
    }

    // 验证球队是否存在
    const team = await db.getTeamById(player.teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        error: '球队不存在'
      });
    }

    // 保存到数据库
    const playerId = await db.savePlayer(player);

    res.status(201).json({
      success: true,
      message: '球员创建成功并已保存到数据库',
      data: {
        id: playerId,
        ...player
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '创建球员失败'
    });
  }
});

// ========== 比赛相关API ==========

// 获取所有比赛
router.get('/matches', async (req: Request, res: Response) => {
  try {
    const matches = await db.getAllMatches();
    res.json({
      success: true,
      count: matches.length,
      data: matches
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取比赛数据失败'
    });
  }
});

// 根据球队ID获取比赛
router.get('/matches/team/:teamId', async (req: Request, res: Response) => {
  try {
    const teamId = parseInt(req.params.teamId);
    const matches = await db.getMatchesByTeamId(teamId);

    res.json({
      success: true,
      count: matches.length,
      data: matches
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取比赛数据失败'
    });
  }
});

// 创建新比赛（并持久化到数据库）
router.post('/matches', async (req: Request, res: Response) => {
  try {
    const match: Omit<Match, 'id'> = req.body;

    // 验证必填字段
    if (!match.homeTeamId || !match.awayTeamId || !match.matchDate) {
      return res.status(400).json({
        success: false,
        error: '缺少必填字段: homeTeamId, awayTeamId, matchDate'
      });
    }

    // 验证球队是否存在
    const homeTeam = await db.getTeamById(match.homeTeamId);
    const awayTeam = await db.getTeamById(match.awayTeamId);

    if (!homeTeam || !awayTeam) {
      return res.status(404).json({
        success: false,
        error: '主队或客队不存在'
      });
    }

    // 保存到数据库
    const matchId = await db.saveMatch(match);

    res.status(201).json({
      success: true,
      message: '比赛创建成功并已保存到数据库',
      data: {
        id: matchId,
        ...match
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '创建比赛失败'
    });
  }
});

// ========== 统计API ==========

// 获取数据库统计信息
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const teams = await db.getAllTeams();
    const players = await db.getAllPlayers();
    const matches = await db.getAllMatches();

    res.json({
      success: true,
      data: {
        totalTeams: teams.length,
        totalPlayers: players.length,
        totalMatches: matches.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取统计数据失败'
    });
  }
});

// ========== 商品相关API ==========

// 获取所有商品
router.get('/products', async (req: Request, res: Response) => {
  try {
    const products = await db.getAllProducts();
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取商品数据失败'
    });
  }
});

// 根据分类获取商品
router.get('/products/category/:category', async (req: Request, res: Response) => {
  try {
    const category = req.params.category;
    const products = await db.getProductsByCategory(category);
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取商品数据失败'
    });
  }
});

// 根据ID获取商品
router.get('/products/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const product = await db.getProductById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: '商品不存在'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取商品数据失败'
    });
  }
});

// 创建新商品（并持久化到数据库）
router.post('/products', async (req: Request, res: Response) => {
  try {
    const product: Omit<Product, 'id'> = req.body;

    if (!product.name || !product.price || !product.category) {
      return res.status(400).json({
        success: false,
        error: '缺少必填字段: name, price, category'
      });
    }

    const productId = await db.saveProduct(product);

    res.status(201).json({
      success: true,
      message: '商品创建成功并已保存到数据库',
      data: {
        id: productId,
        ...product
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '创建商品失败'
    });
  }
});

// ========== 用户相关API ==========

// 获取所有用户
router.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await db.getAllUsers();
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取用户数据失败'
    });
  }
});

// 根据ID获取用户
router.get('/users/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const user = await db.getUserById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: '用户不存在'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取用户数据失败'
    });
  }
});

// 创建新用户
router.post('/users', async (req: Request, res: Response) => {
  try {
    const user: Omit<User, 'id'> = req.body;

    if (!user.username || !user.email) {
      return res.status(400).json({
        success: false,
        error: '缺少必填字段: username, email'
      });
    }

    const userId = await db.saveUser(user);

    res.status(201).json({
      success: true,
      message: '用户创建成功',
      data: {
        id: userId,
        ...user,
        coins: user.coins || 1000
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '创建用户失败'
    });
  }
});

// 获取用户投注统计
router.get('/users/:id/stats', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const stats = await bettingService.getUserBettingStats(id);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取用户投注统计失败'
    });
  }
});

// ========== 赌球相关API ==========

// 创建投注
router.post('/bets', async (req: Request, res: Response) => {
  try {
    const { userId, matchId, betType, amount } = req.body;

    if (!userId || !matchId || !betType || !amount) {
      return res.status(400).json({
        success: false,
        error: '缺少必填字段: userId, matchId, betType, amount'
      });
    }

    const result = await bettingService.placeBet(userId, matchId, betType, amount);

    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '创建投注失败'
    });
  }
});

// 获取用户的所有投注
router.get('/bets/user/:userId', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const bets = await db.getBetsByUserId(userId);

    res.json({
      success: true,
      count: bets.length,
      data: bets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取用户投注失败'
    });
  }
});

// 获取比赛的所有投注
router.get('/bets/match/:matchId', async (req: Request, res: Response) => {
  try {
    const matchId = parseInt(req.params.matchId);
    const bets = await db.getBetsByMatchId(matchId);

    res.json({
      success: true,
      count: bets.length,
      data: bets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取比赛投注失败'
    });
  }
});

// 获取比赛投注统计
router.get('/bets/match/:matchId/stats', async (req: Request, res: Response) => {
  try {
    const matchId = parseInt(req.params.matchId);
    const stats = await bettingService.getMatchBettingStats(matchId);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取比赛投注统计失败'
    });
  }
});

// 结算比赛投注（管理员接口）
router.post('/bets/settle/:matchId', async (req: Request, res: Response) => {
  try {
    const matchId = parseInt(req.params.matchId);
    const result = await bettingService.settleBets(matchId);

    res.json({
      success: true,
      message: '投注结算完成',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '结算投注失败'
    });
  }
});

// 获取排行榜
router.get('/leaderboard', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const leaderboard = await bettingService.getLeaderboard(limit);

    res.json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取排行榜失败'
    });
  }
});

// 更新比赛结果（管理员接口）
router.put('/matches/:id/result', async (req: Request, res: Response) => {
  try {
    const matchId = parseInt(req.params.id);
    const { homeScore, awayScore, status } = req.body;

    if (homeScore === undefined || awayScore === undefined || !status) {
      return res.status(400).json({
        success: false,
        error: '缺少必填字段: homeScore, awayScore, status'
      });
    }

    await db.updateMatchResult(matchId, homeScore, awayScore, status);

    // 如果比赛结束，自动结算投注
    if (status === 'finished') {
      await bettingService.settleBets(matchId);
    }

    res.json({
      success: true,
      message: '比赛结果已更新'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '更新比赛结果失败'
    });
  }
});

export default router;
