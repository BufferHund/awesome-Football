import { PrismaClient } from '@prisma/client';
import { footballApiService, ApiMatch, LEAGUES } from './footballApi';

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
};

// 定时任务 - 每5分钟更新一次直播比赛
export function startSyncScheduler() {
  // 立即执行一次
  syncService.syncTodayMatches();
  syncService.syncLiveMatches();

  // 每5分钟更新直播比赛
  setInterval(() => {
    syncService.syncLiveMatches();
  }, 5 * 60 * 1000);

  // 每小时更新今日比赛
  setInterval(() => {
    syncService.syncTodayMatches();
  }, 60 * 60 * 1000);

  // 每天凌晨2点同步积分榜
  setInterval(() => {
    const now = new Date();
    if (now.getHours() === 2) {
      syncService.syncStandings(LEAGUES.PREMIER_LEAGUE, '英超');
      syncService.syncStandings(LEAGUES.LA_LIGA, '西甲');
      syncService.syncStandings(LEAGUES.BUNDESLIGA, '德甲');
    }
  }, 60 * 60 * 1000);
}
