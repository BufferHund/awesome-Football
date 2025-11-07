import axios from 'axios';
import Database from '../database/db';
import { Team, Player, Match } from '../models/types';

// 足球数据爬虫类
class FootballCrawler {
  private db: Database;

  constructor() {
    this.db = Database.getInstance();
  }

  // 模拟从API获取球队数据并持久化到数据库
  async crawlAndSaveTeams(): Promise<void> {
    console.log('\n=== 开始爬取球队数据 ===');

    try {
      // 模拟从外部API获取数据
      // 在实际应用中，这里会调用真实的足球数据API，如 football-data.org, API-FOOTBALL等
      const teams = await this.fetchTeamsFromAPI();

      console.log(`爬取到 ${teams.length} 支球队`);

      // 持久化到数据库
      const savedIds = await this.db.saveTeams(teams);

      console.log(`✓ 成功保存 ${savedIds.length} 支球队到数据库`);

      return;
    } catch (error) {
      console.error('爬取球队数据失败:', error);
      throw error;
    }
  }

  // 模拟从API获取球员数据并持久化到数据库
  async crawlAndSavePlayers(): Promise<void> {
    console.log('\n=== 开始爬取球员数据 ===');

    try {
      // 首先获取所有球队，以便关联球员
      const teams = await this.db.getAllTeams();

      if (teams.length === 0) {
        console.log('⚠ 数据库中没有球队数据，请先爬取球队数据');
        return;
      }

      // 模拟从外部API获取数据
      const players = await this.fetchPlayersFromAPI(teams);

      console.log(`爬取到 ${players.length} 名球员`);

      // 持久化到数据库
      const savedIds = await this.db.savePlayers(players);

      console.log(`✓ 成功保存 ${savedIds.length} 名球员到数据库`);

      return;
    } catch (error) {
      console.error('爬取球员数据失败:', error);
      throw error;
    }
  }

  // 模拟从API获取比赛数据并持久化到数据库
  async crawlAndSaveMatches(): Promise<void> {
    console.log('\n=== 开始爬取比赛数据 ===');

    try {
      // 首先获取所有球队，以便关联比赛
      const teams = await this.db.getAllTeams();

      if (teams.length < 2) {
        console.log('⚠ 数据库中球队数据不足，请先爬取球队数据');
        return;
      }

      // 模拟从外部API获取数据
      const matches = await this.fetchMatchesFromAPI(teams);

      console.log(`爬取到 ${matches.length} 场比赛`);

      // 持久化到数据库
      const savedIds = await this.db.saveMatches(matches);

      console.log(`✓ 成功保存 ${savedIds.length} 场比赛到数据库`);

      return;
    } catch (error) {
      console.error('爬取比赛数据失败:', error);
      throw error;
    }
  }

  // 爬取所有数据
  async crawlAll(): Promise<void> {
    console.log('\n========== 开始爬取所有足球数据 ==========');

    await this.crawlAndSaveTeams();
    await this.crawlAndSavePlayers();
    await this.crawlAndSaveMatches();

    console.log('\n========== 所有数据爬取完成！==========\n');
  }

  // ========== 以下是模拟API数据获取的私有方法 ==========
  // 在实际应用中，这些方法会调用真实的外部API

  private async fetchTeamsFromAPI(): Promise<Omit<Team, 'id'>[]> {
    // 模拟API延迟
    await this.delay(500);

    // 模拟从API返回的数据
    return [
      {
        name: '利物浦',
        country: '英格兰',
        founded: 1892,
        stadium: '安菲尔德球场'
      },
      {
        name: '尤文图斯',
        country: '意大利',
        founded: 1897,
        stadium: '安联球场'
      },
      {
        name: '阿贾克斯',
        country: '荷兰',
        founded: 1900,
        stadium: '约翰·克鲁伊夫球场'
      }
    ];
  }

  private async fetchPlayersFromAPI(teams: Team[]): Promise<Omit<Player, 'id'>[]> {
    // 模拟API延迟
    await this.delay(500);

    // 为每个球队生成一些球员
    const players: Omit<Player, 'id'>[] = [];

    if (teams.length > 0) {
      players.push(
        {
          name: '萨拉赫',
          teamId: teams[0].id,
          position: '前锋',
          age: 31,
          nationality: '埃及'
        },
        {
          name: '范迪克',
          teamId: teams[0].id,
          position: '后卫',
          age: 32,
          nationality: '荷兰'
        }
      );
    }

    if (teams.length > 1) {
      players.push(
        {
          name: '弗拉霍维奇',
          teamId: teams[1].id,
          position: '前锋',
          age: 23,
          nationality: '塞尔维亚'
        },
        {
          name: '洛卡特利',
          teamId: teams[1].id,
          position: '中场',
          age: 25,
          nationality: '意大利'
        }
      );
    }

    if (teams.length > 2) {
      players.push(
        {
          name: '布罗比',
          teamId: teams[2].id,
          position: '前锋',
          age: 21,
          nationality: '荷兰'
        },
        {
          name: '泰勒',
          teamId: teams[2].id,
          position: '中场',
          age: 22,
          nationality: '荷兰'
        }
      );
    }

    return players;
  }

  private async fetchMatchesFromAPI(teams: Team[]): Promise<Omit<Match, 'id'>[]> {
    // 模拟API延迟
    await this.delay(500);

    // 生成一些比赛数据
    const matches: Omit<Match, 'id'>[] = [];

    if (teams.length >= 2) {
      matches.push({
        homeTeamId: teams[0].id,
        awayTeamId: teams[1].id,
        homeScore: 2,
        awayScore: 0,
        matchDate: '2024-11-10',
        competition: '欧冠联赛',
        status: 'finished' as const
      });
    }

    if (teams.length >= 3) {
      matches.push({
        homeTeamId: teams[1].id,
        awayTeamId: teams[2].id,
        homeScore: 1,
        awayScore: 1,
        matchDate: '2024-11-12',
        competition: '欧冠联赛',
        status: 'finished' as const
      });

      matches.push({
        homeTeamId: teams[2].id,
        awayTeamId: teams[0].id,
        homeScore: 0,
        awayScore: 3,
        matchDate: '2024-11-15',
        competition: '欧冠联赛',
        status: 'finished' as const
      });
    }

    return matches;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default FootballCrawler;
