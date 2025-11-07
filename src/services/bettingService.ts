import Database from '../database/db';
import { Bet, Match, User } from '../models/types';

// 趣味赌球服务类
// 注意：这是纯娱乐性质的虚拟投注系统，不涉及真实货币
class BettingService {
  private db: Database;

  constructor() {
    this.db = Database.getInstance();
  }

  // 计算赔率（根据比赛双方实力简单计算）
  private calculateOdds(match: Match): { home: number; draw: number; away: number } {
    // 简化的赔率计算逻辑
    // 实际应用中可以根据球队历史战绩、排名等因素计算
    return {
      home: 2.5,
      draw: 3.2,
      away: 2.8
    };
  }

  // 创建投注
  async placeBet(
    userId: number,
    matchId: number,
    betType: 'home' | 'away' | 'draw',
    amount: number
  ): Promise<{ success: boolean; message: string; betId?: number }> {
    try {
      // 验证用户
      const user = await this.db.getUserById(userId);
      if (!user) {
        return { success: false, message: '用户不存在' };
      }

      // 验证金币是否足够
      if (user.coins < amount) {
        return { success: false, message: '金币不足' };
      }

      // 验证投注金额
      if (amount <= 0) {
        return { success: false, message: '投注金额必须大于0' };
      }

      // 验证比赛
      const match = await this.db.getAllMatches().then(matches =>
        matches.find(m => m.id === matchId)
      );

      if (!match) {
        return { success: false, message: '比赛不存在' };
      }

      // 只能对未开始的比赛投注
      if (match.status !== 'upcoming') {
        return { success: false, message: '只能对未开始的比赛投注' };
      }

      // 计算赔率和潜在收益
      const odds = this.calculateOdds(match);
      const betOdds = odds[betType];
      const potentialWin = amount * betOdds;

      // 扣除用户金币
      await this.db.updateUserCoins(userId, user.coins - amount);

      // 保存投注记录
      const betId = await this.db.saveBet({
        userId,
        matchId,
        betType,
        amount,
        odds: betOdds,
        status: 'pending',
        potentialWin
      });

      return {
        success: true,
        message: `投注成功！投注${amount}金币，潜在收益${potentialWin.toFixed(2)}金币`,
        betId
      };
    } catch (error) {
      console.error('投注失败:', error);
      return { success: false, message: '投注失败，请稍后重试' };
    }
  }

  // 结算比赛投注
  async settleBets(matchId: number): Promise<{ settled: number; totalPayout: number }> {
    try {
      // 获取比赛信息
      const matches = await this.db.getAllMatches();
      const match = matches.find(m => m.id === matchId);

      if (!match) {
        throw new Error('比赛不存在');
      }

      if (match.status !== 'finished') {
        throw new Error('比赛尚未结束');
      }

      // 确定比赛结果
      let result: 'home' | 'away' | 'draw';
      if (match.homeScore > match.awayScore) {
        result = 'home';
      } else if (match.homeScore < match.awayScore) {
        result = 'away';
      } else {
        result = 'draw';
      }

      // 获取该比赛的所有待结算投注
      const bets = await this.db.getBetsByMatchId(matchId);
      const pendingBets = bets.filter(bet => bet.status === 'pending');

      let settledCount = 0;
      let totalPayout = 0;

      // 结算每笔投注
      for (const bet of pendingBets) {
        const won = bet.betType === result;
        const newStatus = won ? 'won' : 'lost';

        // 更新投注状态
        await this.db.updateBetStatus(bet.id, newStatus);

        // 如果赢了，给用户发放奖金
        if (won) {
          const user = await this.db.getUserById(bet.userId);
          if (user) {
            const newCoins = user.coins + bet.potentialWin;
            await this.db.updateUserCoins(bet.userId, newCoins);
            totalPayout += bet.potentialWin;
          }
        }

        settledCount++;
      }

      console.log(`✓ 比赛 ${matchId} 投注已结算: ${settledCount} 笔，总派彩 ${totalPayout.toFixed(2)} 金币`);

      return { settled: settledCount, totalPayout };
    } catch (error) {
      console.error('结算投注失败:', error);
      throw error;
    }
  }

  // 获取用户投注历史（包括输赢统计）
  async getUserBettingStats(userId: number): Promise<{
    totalBets: number;
    wonBets: number;
    lostBets: number;
    pendingBets: number;
    totalWagered: number;
    totalWon: number;
    netProfit: number;
  }> {
    try {
      const bets = await this.db.getBetsByUserId(userId);

      const stats = {
        totalBets: bets.length,
        wonBets: bets.filter(b => b.status === 'won').length,
        lostBets: bets.filter(b => b.status === 'lost').length,
        pendingBets: bets.filter(b => b.status === 'pending').length,
        totalWagered: bets.reduce((sum, b) => sum + b.amount, 0),
        totalWon: bets.filter(b => b.status === 'won').reduce((sum, b) => sum + b.potentialWin, 0),
        netProfit: 0
      };

      stats.netProfit = stats.totalWon - stats.totalWagered;

      return stats;
    } catch (error) {
      console.error('获取用户投注统计失败:', error);
      throw error;
    }
  }

  // 获取比赛投注统计
  async getMatchBettingStats(matchId: number): Promise<{
    totalBets: number;
    homeBets: number;
    awayBets: number;
    drawBets: number;
    totalAmount: number;
  }> {
    try {
      const bets = await this.db.getBetsByMatchId(matchId);

      return {
        totalBets: bets.length,
        homeBets: bets.filter(b => b.betType === 'home').length,
        awayBets: bets.filter(b => b.betType === 'away').length,
        drawBets: bets.filter(b => b.betType === 'draw').length,
        totalAmount: bets.reduce((sum, b) => sum + b.amount, 0)
      };
    } catch (error) {
      console.error('获取比赛投注统计失败:', error);
      throw error;
    }
  }

  // 获取排行榜（按金币数量）
  async getLeaderboard(limit: number = 10): Promise<User[]> {
    try {
      const users = await this.db.getAllUsers();
      return users.sort((a, b) => b.coins - a.coins).slice(0, limit);
    } catch (error) {
      console.error('获取排行榜失败:', error);
      throw error;
    }
  }
}

export default BettingService;
