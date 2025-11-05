import axios from 'axios';

const API_KEY = process.env.FOOTBALL_API_KEY || 'your-api-key-here';
const BASE_URL = 'https://v3.football.api-sports.io';

// API-Football 免费版每天100次请求
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'x-rapidapi-key': API_KEY,
    'x-rapidapi-host': 'v3.football.api-sports.io',
  },
  timeout: 10000,
});

export interface ApiMatch {
  fixture: {
    id: number;
    date: string;
    status: {
      short: string; // NS, LIVE, FT, etc
    };
    venue: {
      name: string;
    };
  };
  league: {
    name: string;
    round: string;
  };
  teams: {
    home: {
      id: number;
      name: string;
      logo: string;
    };
    away: {
      id: number;
      name: string;
      logo: string;
    };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  events?: Array<{
    time: { elapsed: number };
    team: { name: string };
    player: { name: string };
    type: string; // Goal, Card, subst
    detail: string;
  }>;
}

export const footballApiService = {
  // 获取今日比赛
  async getTodayMatches(leagueId?: number): Promise<ApiMatch[]> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const params: any = { date: today };
      if (leagueId) params.league = leagueId;

      const response = await apiClient.get('/fixtures', { params });
      return response.data.response || [];
    } catch (error) {
      console.error('获取今日比赛失败:', error);
      return [];
    }
  },

  // 获取直播比赛
  async getLiveMatches(): Promise<ApiMatch[]> {
    try {
      const response = await apiClient.get('/fixtures', { params: { live: 'all' } });
      return response.data.response || [];
    } catch (error) {
      console.error('获取直播比赛失败:', error);
      return [];
    }
  },

  // 获取比赛详情
  async getMatchById(fixtureId: number): Promise<ApiMatch | null> {
    try {
      const response = await apiClient.get('/fixtures', { params: { id: fixtureId } });
      return response.data.response?.[0] || null;
    } catch (error) {
      console.error('获取比赛详情失败:', error);
      return null;
    }
  },

  // 获取积分榜
  async getStandings(leagueId: number, season: number = new Date().getFullYear()) {
    try {
      const response = await apiClient.get('/standings', {
        params: { league: leagueId, season },
      });
      return response.data.response?.[0]?.league?.standings?.[0] || [];
    } catch (error) {
      console.error('获取积分榜失败:', error);
      return [];
    }
  },

  // 获取球队信息
  async getTeamById(teamId: number) {
    try {
      const response = await apiClient.get('/teams', { params: { id: teamId } });
      return response.data.response?.[0] || null;
    } catch (error) {
      console.error('获取球队信息失败:', error);
      return null;
    }
  },

  // 获取球队球员
  async getTeamPlayers(teamId: number, season: number = new Date().getFullYear()) {
    try {
      const response = await apiClient.get('/players/squads', {
        params: { team: teamId },
      });
      return response.data.response?.[0]?.players || [];
    } catch (error) {
      console.error('获取球员信息失败:', error);
      return [];
    }
  },
};

// 热门联赛ID
export const LEAGUES = {
  PREMIER_LEAGUE: 39, // 英超
  LA_LIGA: 140, // 西甲
  BUNDESLIGA: 78, // 德甲
  SERIE_A: 135, // 意甲
  LIGUE_1: 61, // 法甲
  CHAMPIONS_LEAGUE: 2, // 欧冠
  EUROPA_LEAGUE: 3, // 欧联
  WORLD_CUP: 1, // 世界杯
};
