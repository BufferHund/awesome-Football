import { PrismaClient } from '@prisma/client';
import { logService } from './logService';

const prisma = new PrismaClient();

/**
 * 数据库初始化服务
 * 在应用启动时自动填充种子数据，确保1分钟内完成初始化
 */
export class InitService {
  /**
   * 初始化数据库
   */
  async initialize(): Promise<void> {
    const startTime = Date.now();
    logService.info('InitService', '开始初始化数据库...');

    try {
      // 1. 测试数据库连接
      await this.testConnection();

      // 2. 检查并填充种子数据
      await this.ensureSeedData();

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      logService.success('InitService', `数据库初始化完成，耗时: ${duration}秒`);
    } catch (error) {
      logService.error('InitService', '数据库初始化失败', error);
      throw error;
    }
  }

  /**
   * 测试数据库连接（带重试）
   */
  private async testConnection(): Promise<void> {
    logService.info('InitService', '测试数据库连接...');

    const maxRetries = 10;
    const retryDelay = 2000; // 2秒

    for (let i = 0; i < maxRetries; i++) {
      try {
        await prisma.$connect();
        await prisma.$queryRaw`SELECT 1`; // 简单查询测试
        logService.success('InitService', '数据库连接成功');
        return;
      } catch (error) {
        if (i < maxRetries - 1) {
          logService.warn('InitService', `数据库连接失败，${retryDelay/1000}秒后重试... (${i + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        } else {
          logService.error('InitService', '数据库连接失败，已达到最大重试次数', error);
          throw new Error('无法连接到数据库');
        }
      }
    }
  }

  /**
   * 确保种子数据存在
   */
  private async ensureSeedData(): Promise<void> {
    logService.info('InitService', '检查种子数据...');

    // 检查各表的数据
    const [teamCount, matchCount, newsCount] = await Promise.all([
      prisma.team.count(),
      prisma.match.count(),
      prisma.news.count(),
    ]);

    logService.info('InitService', `当前数据量 - Teams: ${teamCount}, Matches: ${matchCount}, News: ${newsCount}`);

    // 如果数据为空，填充种子数据
    if (teamCount === 0) {
      await this.seedTeams();
    }

    if (matchCount === 0) {
      await this.seedMatches();
    }

    if (newsCount === 0) {
      await this.seedNews();
    }

    logService.success('InitService', '种子数据检查完成');
  }

  /**
   * 填充球队种子数据
   */
  private async seedTeams(): Promise<void> {
    logService.info('InitService', '填充球队种子数据...');

    const teams = [
      { name: 'Manchester United', shortName: 'Man Utd', country: 'England', logo: 'https://media.api-sports.io/football/teams/33.png', stadium: 'Old Trafford', founded: 1878 },
      { name: 'Manchester City', shortName: 'Man City', country: 'England', logo: 'https://media.api-sports.io/football/teams/50.png', stadium: 'Etihad Stadium', founded: 1880 },
      { name: 'Liverpool', shortName: 'Liverpool', country: 'England', logo: 'https://media.api-sports.io/football/teams/40.png', stadium: 'Anfield', founded: 1892 },
      { name: 'Chelsea', shortName: 'Chelsea', country: 'England', logo: 'https://media.api-sports.io/football/teams/49.png', stadium: 'Stamford Bridge', founded: 1905 },
      { name: 'Arsenal', shortName: 'Arsenal', country: 'England', logo: 'https://media.api-sports.io/football/teams/42.png', stadium: 'Emirates Stadium', founded: 1886 },
      { name: 'Tottenham', shortName: 'Spurs', country: 'England', logo: 'https://media.api-sports.io/football/teams/47.png', stadium: 'Tottenham Hotspur Stadium', founded: 1882 },
      { name: 'Real Madrid', shortName: 'Real Madrid', country: 'Spain', logo: 'https://media.api-sports.io/football/teams/541.png', stadium: 'Santiago Bernabéu', founded: 1902 },
      { name: 'Barcelona', shortName: 'Barcelona', country: 'Spain', logo: 'https://media.api-sports.io/football/teams/529.png', stadium: 'Camp Nou', founded: 1899 },
      { name: 'Bayern Munich', shortName: 'Bayern', country: 'Germany', logo: 'https://media.api-sports.io/football/teams/157.png', stadium: 'Allianz Arena', founded: 1900 },
      { name: 'Paris Saint-Germain', shortName: 'PSG', country: 'France', logo: 'https://media.api-sports.io/football/teams/85.png', stadium: 'Parc des Princes', founded: 1970 },
    ];

    for (const team of teams) {
      await prisma.team.create({ data: team });
    }

    logService.success('InitService', `填充了 ${teams.length} 支球队`);
  }

  /**
   * 填充比赛种子数据
   */
  private async seedMatches(): Promise<void> {
    logService.info('InitService', '填充比赛种子数据...');

    // 获取已创建的球队
    const teams = await prisma.team.findMany({ take: 10 });

    if (teams.length < 4) {
      logService.warn('InitService', '球队数据不足，跳过比赛种子数据');
      return;
    }

    const now = new Date();
    const today = new Date(now);
    today.setHours(20, 0, 0, 0);

    const matches = [
      {
        homeTeamId: teams[0].id,
        awayTeamId: teams[1].id,
        homeScore: 2,
        awayScore: 1,
        status: 'FINISHED',
        matchDate: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        venue: teams[0].stadium,
        competition: '英超',
        round: '第15轮',
      },
      {
        homeTeamId: teams[2].id,
        awayTeamId: teams[3].id,
        homeScore: null,
        awayScore: null,
        status: 'SCHEDULED',
        matchDate: today,
        venue: teams[2].stadium,
        competition: '英超',
        round: '第16轮',
      },
      {
        homeTeamId: teams[4].id,
        awayTeamId: teams[5].id,
        homeScore: 1,
        awayScore: 1,
        status: 'FINISHED',
        matchDate: new Date(now.getTime() - 48 * 60 * 60 * 1000),
        venue: teams[4].stadium,
        competition: '英超',
        round: '第14轮',
      },
    ];

    for (const match of matches) {
      await prisma.match.create({ data: match });
    }

    logService.success('InitService', `填充了 ${matches.length} 场比赛`);
  }

  /**
   * 填充新闻种子数据
   */
  private async seedNews(): Promise<void> {
    logService.info('InitService', '填充新闻种子数据...');

    const news = [
      {
        title: '英超：曼城3-1战胜利物浦，哈兰德梅开二度',
        summary: '在昨晚的英超焦点战中，曼城主场3-1战胜利物浦，哈兰德梅开二度帮助球队取得关键胜利',
        content: '在昨晚的英超焦点战中，曼城主场3-1战胜利物浦。挪威前锋哈兰德梅开二度，德布劳内助攻两次，帮助曼城在积分榜上保持领先优势。',
        coverImage: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800',
        category: '英超',
        author: 'Football',
        views: 1250,
      },
      {
        title: '皇马官宣：贝林厄姆荣膺2024金球奖',
        summary: '皇家马德里中场贝林厄姆在巴黎领取了2024年金球奖，成为历史上最年轻的金球奖得主',
        content: '在巴黎举行的2024年金球奖颁奖典礼上，21岁的贝林厄姆击败哈兰德、姆巴佩等球星，成功捧起金球奖杯。',
        coverImage: 'https://images.unsplash.com/photo-1614632537382-f9cd9e8a03ea?w=800',
        category: '西甲',
        author: 'Football',
        views: 3580,
      },
      {
        title: '转会爆料：拜仁慕尼黑有意签下凯恩',
        summary: '德国媒体报道，拜仁慕尼黑正在积极运作，希望在冬窗签下英格兰前锋哈里·凯恩',
        content: '据德国《图片报》报道，拜仁慕尼黑已经与凯恩的经纪人进行了初步接触，希望能在冬季转会窗口完成这笔交易。',
        coverImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
        category: '转会',
        author: 'Football',
        views: 2150,
      },
      {
        title: '欧冠：巴黎圣日耳曼2-0击败AC米兰',
        summary: '在昨晚的欧冠小组赛中，巴黎圣日耳曼主场2-0战胜AC米兰，姆巴佩打入制胜球',
        content: '在王子公园球场，巴黎圣日耳曼凭借姆巴佩和内马尔的进球，2-0战胜来访的AC米兰，取得欧冠小组赛三连胜。',
        coverImage: 'https://images.unsplash.com/photo-1522778526097-ce0a22ceb253?w=800',
        category: '欧冠',
        author: 'Football',
        views: 1890,
      },
      {
        title: '战术分析：瓜迪奥拉如何改造曼城中场',
        summary: '本文深入分析瓜迪奥拉本赛季对曼城中场体系的改造，以及罗德里在其中的关键作用',
        content: '瓜迪奥拉本赛季在曼城中场进行了大胆的战术调整，罗德里从后腰位置前移，与德布劳内形成双核，这一改变让曼城的进攻更加流畅。',
        coverImage: 'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?w=800',
        category: '战术分析',
        author: 'Football',
        views: 980,
      },
      {
        title: '西甲：巴塞罗那4-0大胜皇家贝蒂斯',
        summary: '莱万多夫斯基上演帽子戏法，巴塞罗那主场4-0大胜贝蒂斯，继续领跑西甲积分榜',
        content: '在诺坎普球场，巴塞罗那凭借莱万多夫斯基的帽子戏法，4-0横扫皇家贝蒂斯，继续在西甲积分榜上保持领先。',
        coverImage: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800',
        category: '西甲',
        author: 'Football',
        views: 1560,
      },
    ];

    for (const item of news) {
      await prisma.news.create({ data: item });
    }

    logService.success('InitService', `填充了 ${news.length} 条新闻`);
  }
}

export const initService = new InitService();
