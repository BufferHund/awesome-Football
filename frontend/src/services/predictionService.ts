import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export interface Prediction {
  id: number;
  userId: number;
  matchId: number;
  predictedHomeScore: number;
  predictedAwayScore: number;
  predictedWinner: 'HOME' | 'AWAY' | 'DRAW';
  points: number;
  isCorrect: boolean | null;
  createdAt: string;
  updatedAt: string;
  match?: any;
}

export interface PredictionStats {
  total: number;
  homeWin: number;
  awayWin: number;
  draw: number;
}

export interface LeaderboardEntry {
  id: number;
  username: string;
  avatar: string | null;
  totalPoints: number;
  membershipTier: string;
  rank: number;
}

export interface MyRank {
  rank: number;
  totalPoints: number;
}

export const predictionService = {
  /**
   * 创建预测
   */
  async createPrediction(data: {
    matchId: number;
    predictedHomeScore: number;
    predictedAwayScore: number;
    predictedWinner: 'HOME' | 'AWAY' | 'DRAW';
  }): Promise<Prediction> {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/predictions`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  /**
   * 获取我的预测列表
   */
  async getMyPredictions(status?: string): Promise<Prediction[]> {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/predictions/my`, {
      params: { status },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  /**
   * 获取比赛的预测统计
   */
  async getMatchStats(matchId: number): Promise<PredictionStats> {
    const response = await axios.get(`${API_BASE_URL}/predictions/match/${matchId}`);
    return response.data;
  },

  /**
   * 获取排行榜
   */
  async getLeaderboard(limit: number = 100): Promise<LeaderboardEntry[]> {
    const response = await axios.get(`${API_BASE_URL}/predictions/leaderboard`, {
      params: { limit },
    });
    return response.data;
  },

  /**
   * 获取我的排名
   */
  async getMyRank(): Promise<MyRank> {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/predictions/my-rank`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};
