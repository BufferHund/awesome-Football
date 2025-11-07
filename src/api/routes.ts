import express, { Request, Response } from 'express';
import Database from '../database/db';
import { Team, Player, Match } from '../models/types';

const router = express.Router();
const db = Database.getInstance();

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

export default router;
