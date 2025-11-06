import { PrismaClient } from '@prisma/client';
import { footballApiService, ApiMatch, LEAGUES } from './footballApi';
import { webScraperService } from './webScraper';
import { logService } from './logService';

const prisma = new PrismaClient();

// 数据同步服务 - 从API同步到数据库
export const syncService = {
  // 同步今日比赛
  async syncTodayMatches(): Promise<void> {
    try {
      console.log('开始同步今日比赛...');

      // 获取多个主要联赛的比赛
      const leagueIds = [
        LEAGUES.PREMIER_LEAGUE,
        LEAGUES.LA_LIGA,
        LEAGUES.BUNDESLIGA,
        LEAGUES.SERIE_A,
        LEAGUES.CHAMPIONS_LEAGUE,
      ];

      for (const leagueId of leagueIds) {
        const matches = await footballApiService.getTodayMatches(leagueId);

        for (const apiMatch of matches) {
          await this.saveMatch(apiMatch);
        }
      }

      console.log('今日比赛同步完成');
    } catch (error) {
      console.error('同步比赛失败:', error);
    }
  },

  // 同步直播比赛
  async syncLiveMatches(): Promise<void> {
    try {
      console.log('开始同步直播比赛...');
      const matches = await footballApiService.getLiveMatches();

      for (const apiMatch of matches) {
        await this.saveMatch(apiMatch);
      }

      console.log('直播比赛同步完成');
    } catch (error) {
      console.error('同步直播比赛失败:', error);
    }
  },

  // 同步积分榜
  async syncStandings(leagueId: number, leagueName: string): Promise<void> {
    try {
      console.log(`开始同步${leagueName}积分榜...`);
      const standings = await footballApiService.getStandings(leagueId);

      for (const standing of standings) {
        // 确保球队存在
        const team = await this.ensureTeam({
          id: standing.team.id,
          name: standing.team.name,
          logo: standing.team.logo,
        });

        // 更新或创建积分榜记录
        await prisma.standing.upsert({
          where: {
            teamId_competition: {
              teamId: team.id,
              competition: leagueName,
            },
          },
          update: {
            position: standing.rank,
            played: standing.all.played,
            won: standing.all.win,
            drawn: standing.all.draw,
            lost: standing.all.lose,
            goalsFor: standing.all.goals.for,
            goalsAgainst: standing.all.goals.against,
            goalDiff: standing.goalsDiff,
            points: standing.points,
            form: standing.form,
          },
          create: {
            teamId: team.id,
            competition: leagueName,
            position: standing.rank,
            played: standing.all.played,
            won: standing.all.win,
            drawn: standing.all.draw,
            lost: standing.all.lose,
            goalsFor: standing.all.goals.for,
            goalsAgainst: standing.all.goals.against,
            goalDiff: standing.goalsDiff,
            points: standing.points,
            form: standing.form,
          },
        });
      }

      console.log(`${leagueName}积分榜同步完成`);
    } catch (error) {
      console.error('同步积分榜失败:', error);
    }
  },

  // 保存比赛到数据库
  async saveMatch(apiMatch: ApiMatch): Promise<void> {
    try {
      // 确保主队存在
      const homeTeam = await this.ensureTeam({
        id: apiMatch.teams.home.id,
        name: apiMatch.teams.home.name,
        logo: apiMatch.teams.home.logo,
      });

      // 确保客队存在
      const awayTeam = await this.ensureTeam({
        id: apiMatch.teams.away.id,
        name: apiMatch.teams.away.name,
        logo: apiMatch.teams.away.logo,
      });

      // 转换状态
      const status = this.convertStatus(apiMatch.fixture.status.short);

      // 创建或更新比赛
      const match = await prisma.match.upsert({
        where: { id: apiMatch.fixture.id },
        update: {
          homeScore: apiMatch.goals.home,
          awayScore: apiMatch.goals.away,
          status,
        },
        create: {
          id: apiMatch.fixture.id,
          homeTeamId: homeTeam.id,
          awayTeamId: awayTeam.id,
          homeScore: apiMatch.goals.home,
          awayScore: apiMatch.goals.away,
          status,
          matchDate: new Date(apiMatch.fixture.date),
          venue: apiMatch.fixture.venue?.name,
          competition: apiMatch.league.name,
          round: apiMatch.league.round,
        },
      });

      // 保存比赛事件
      if (apiMatch.events) {
        for (const event of apiMatch.events) {
          // 跳过没有球员信息的事件（如半场结束等系统事件）
          if (!event.player || !event.player.name) {
            continue;
          }

          // 检查是否已存在相同的事件
          const existingEvent = await prisma.matchEvent.findFirst({
            where: {
              matchId: match.id,
              player: event.player.name,
              minute: event.time.elapsed,
              type: this.convertEventType(event.type),
            },
          });

          // 只有不存在时才创建
          if (!existingEvent) {
            await prisma.matchEvent.create({
              data: {
                matchId: match.id,
                type: this.convertEventType(event.type),
                player: event.player.name,
                minute: event.time.elapsed,
                detail: event.detail,
              },
            });
          }
        }
      }
    } catch (error) {
      console.error('保存比赛失败:', error);
    }
  },

  // 确保球队存在
  async ensureTeam(data: { id: number; name: string; logo?: string }): Promise<any> {
    return await prisma.team.upsert({
      where: { id: data.id },
      update: {
        logo: data.logo,
      },
      create: {
        id: data.id,
        name: data.name,
        shortName: data.name.substring(0, 10),
        logo: data.logo,
        country: 'Unknown',
      },
    });
  },

  // 转换比赛状态
  convertStatus(apiStatus: string): string {
    const statusMap: { [key: string]: string } = {
      'NS': 'SCHEDULED', // Not Started
      'LIVE': 'LIVE',
      '1H': 'LIVE', // First Half
      'HT': 'LIVE', // Half Time
      '2H': 'LIVE', // Second Half
      'ET': 'LIVE', // Extra Time
      'P': 'LIVE', // Penalty
      'FT': 'FINISHED', // Full Time
      'AET': 'FINISHED', // After Extra Time
      'PEN': 'FINISHED', // Penalties
      'PST': 'POSTPONED',
      'CANC': 'POSTPONED',
      'ABD': 'POSTPONED',
    };
    return statusMap[apiStatus] || 'SCHEDULED';
  },

  // 转换事件类型
  convertEventType(apiType: string): string {
    const typeMap: { [key: string]: string } = {
      'Goal': 'GOAL',
      'Card': 'CARD',
      'subst': 'SUBSTITUTION',
    };
    return typeMap[apiType] || apiType;
  },

  // 同步新闻数据
  async syncNews(): Promise<void> {
    try {
      logService.info('NewsSync', '开始同步新闻...');

      // 检查数据库是否已有新闻
      const existingCount = await prisma.news.count();
      if (existingCount === 0) {
        logService.info('NewsSync', '数据库无新闻，先添加种子数据');
        await this.seedNewsData();
      }

      // 从多个来源抓取新闻
      const sources = [
        { name: 'BBC Sport', fn: () => webScraperService.scrapeBBCFootballNews() },
        { name: 'ESPN', fn: () => webScraperService.scrapeESPNFootballNews() },
        { name: 'Goal.com', fn: () => webScraperService.scrapeGoalNews() },
      ];

      let totalSaved = 0;

      for (const source of sources) {
        try {
          const newsItems = await source.fn();
          if (newsItems && newsItems.length > 0) {
            logService.info('NewsSync', `从 ${source.name} 获取到 ${newsItems.length} 条新闻`);

            for (const newsItem of newsItems) {
              try {
                // 检查是否已存在相同标题的新闻（去重）
                const existing = await prisma.news.findFirst({
                  where: { title: newsItem.title },
                });

                if (!existing) {
                  await prisma.news.create({
                    data: {
                      title: newsItem.title,
                      summary: newsItem.summary,
                      content: newsItem.content,
                      coverImage: newsItem.coverImage,
                      category: newsItem.category,
                      author: newsItem.author,
                      publishDate: new Date(newsItem.publishDate),
                      views: 0,
                    },
                  });
                  totalSaved++;
                }
              } catch (error) {
                logService.error('NewsSync', `保存新闻失败: ${newsItem.title}`);
              }
            }
          }
        } catch (error) {
          logService.error('NewsSync', `从 ${source.name} 抓取新闻失败`);
        }
      }

      if (totalSaved > 0) {
        logService.success('NewsSync', `新闻同步完成，新增 ${totalSaved} 条新闻`);
      } else {
        logService.info('NewsSync', '本次未获取到新新闻');
      }
    } catch (error) {
      logService.error('NewsSync', '新闻同步失败');
      console.error('同步新闻失败:', error);
    }
  },

  // 添加新闻种子数据
  async seedNewsData(): Promise<void> {
    const seedNews = [
      {
        title: '英超：曼城3-1战胜利物浦',
        summary: '哈兰德梅开二度，曼城在安菲尔德取得关键胜利',
        content: '在昨晚的英超焦点战中，曼城客场3-1战胜利物浦。哈兰德上下半场各进一球，德布劳内助攻并打入一球。这场胜利让曼城在积分榜上领先优势扩大到5分。',
        category: '英超',
        author: 'Football',
      },
      {
        title: '皇马官宣：签下年轻中场新星',
        summary: '皇马从切尔西签下18岁中场，转会费达到7000万欧元',
        content: '皇马官方宣布，从切尔西签下了18岁的英格兰中场新星。这笔转会费高达7000万欧元，创下了俱乐部引援纪录。',
        category: '转会',
        author: 'Football',
      },
      {
        title: '欧冠抽签结果出炉',
        summary: '拜仁将对阵巴黎，皇马遭遇曼城',
        content: '今天进行的欧冠淘汰赛抽签仪式上，拜仁慕尼黑抽到了巴黎圣日耳曼，而皇马将对阵卫冕冠军曼城。这些对决都将是火星撞地球的精彩比赛。',
        category: '欧冠',
        author: 'Football',
      },
      {
        title: '梅西谈退役计划：还想再踢2年',
        summary: '阿根廷球星在接受采访时表示希望继续职业生涯',
        content: '在最新的采访中，梅西表示自己的身体状态依然良好，希望能够再踢至少2年。他目前在迈阿密国际效力，帮助球队取得了多项荣誉。',
        category: '球员',
        author: 'Football',
      },
      {
        title: '西甲：巴萨战平马竞',
        summary: '莱万进球，格列兹曼扳平比分',
        content: '在西甲第23轮的比赛中，巴塞罗那主场1-1战平马德里竞技。莱万多夫斯基上半场为巴萨取得领先，格列兹曼下半场扳平比分。',
        category: '西甲',
        author: 'Football',
      },
      {
        title: '曼联主帅：我们需要在转会窗口补强',
        summary: '滕哈赫呼吁俱乐部在冬季转会期引援',
        content: '曼联主帅在赛后新闻发布会上表示，球队需要在即将到来的冬季转会窗口进行补强，尤其是中场和边锋位置。',
        category: '英超',
        author: 'Football',
      },
    ];

    let added = 0;
    for (const news of seedNews) {
      try {
        const existing = await prisma.news.findFirst({
          where: { title: news.title },
        });

        if (!existing) {
          await prisma.news.create({
            data: {
              ...news,
              publishDate: new Date(),
              views: 0,
            },
          });
          added++;
        }
      } catch (error) {
        console.error(`添加种子新闻失败: ${news.title}`, error);
      }
    }

    if (added > 0) {
      logService.success('NewsSync', `已添加 ${added} 条种子新闻数据`);
    }
  },
};

// 定时任务 - 优化频率，减少API调用
export function startSyncScheduler() {
  logService.info('Scheduler', '启动数据同步调度器...');

  // 立即执行一次初始同步
  syncService.syncTodayMatches();
  syncService.syncLiveMatches();
  syncService.syncNews();

  logService.success('Scheduler', '初始数据同步完成');

  // 每10分钟更新直播比赛（减少从每5分钟）
  setInterval(() => {
    logService.info('Scheduler', '执行直播比赛同步...');
    syncService.syncLiveMatches();
  }, 10 * 60 * 1000);

  // 每2小时更新今日比赛（减少从每1小时）
  setInterval(() => {
    logService.info('Scheduler', '执行今日比赛同步...');
    syncService.syncTodayMatches();
  }, 2 * 60 * 60 * 1000);

  // 每6小时同步新闻（新增）
  setInterval(() => {
    logService.info('Scheduler', '执行新闻同步...');
    syncService.syncNews();
  }, 6 * 60 * 60 * 1000);

  // 每天凌晨3点同步积分榜（一天一次即可）
  setInterval(() => {
    const now = new Date();
    if (now.getHours() === 3) {
      logService.info('Scheduler', '执行积分榜同步...');
      syncService.syncStandings(LEAGUES.PREMIER_LEAGUE, '英超');
      syncService.syncStandings(LEAGUES.LA_LIGA, '西甲');
      syncService.syncStandings(LEAGUES.BUNDESLIGA, '德甲');
      syncService.syncStandings(LEAGUES.SERIE_A, '意甲');
    }
  }, 60 * 60 * 1000);

  logService.success('Scheduler', '所有定时任务已设置');
}
