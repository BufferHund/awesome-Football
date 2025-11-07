import { useState, useEffect } from 'react';
import { Trophy, Medal, Crown, TrendingUp, Award } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { predictionService, LeaderboardEntry, MyRank } from '../services/predictionService';

const LeaderboardPage = () => {
  const { isAuthenticated } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [myRank, setMyRank] = useState<MyRank | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [isAuthenticated]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [leaderboardData, rankData] = await Promise.all([
        predictionService.getLeaderboard(100),
        isAuthenticated ? predictionService.getMyRank().catch(() => null) : Promise.resolve(null),
      ]);

      setLeaderboard(leaderboardData);
      setMyRank(rankData);
    } catch (error) {
      console.error('加载排行榜失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-orange-600" />;
    return null;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
    if (rank === 3) return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
    return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
  };

  const getMembershipBadge = (tier: string) => {
    const badges: Record<string, { label: string; color: string }> = {
      ULTIMATE: { label: 'VIP', color: 'bg-purple-500 text-white' },
      PRO: { label: 'PRO', color: 'bg-blue-500 text-white' },
      BASIC: { label: 'BASIC', color: 'bg-green-500 text-white' },
    };
    return badges[tier] || null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">加载排行榜中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 页面标题 */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl mb-4">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            猜球排行榜
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            预测越准，积分越高，快来挑战吧！
          </p>
        </div>

        {/* 我的排名卡片 */}
        {myRank && (
          <div className="mb-6 p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm opacity-90 mb-1">我的排名</div>
                <div className="text-4xl font-bold">#{myRank.rank}</div>
              </div>
              <div className="text-right">
                <div className="text-sm opacity-90 mb-1">总积分</div>
                <div className="text-4xl font-bold">{myRank.totalPoints}</div>
              </div>
              <Award className="w-16 h-16 opacity-20" />
            </div>
          </div>
        )}

        {/* 排行榜列表 */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden">
          {/* 表头 */}
          <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-600 dark:text-gray-400">
              <div className="col-span-2">排名</div>
              <div className="col-span-6">用户</div>
              <div className="col-span-4 text-right">积分</div>
            </div>
          </div>

          {/* 排行榜内容 */}
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {leaderboard.length === 0 ? (
              <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>暂无排行数据</p>
              </div>
            ) : (
              leaderboard.map((entry) => (
                <div
                  key={entry.id}
                  className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* 排名 */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        {getRankIcon(entry.rank)}
                        <span
                          className={`w-10 h-10 flex items-center justify-center rounded-full font-bold ${getRankBadge(
                            entry.rank
                          )}`}
                        >
                          {entry.rank}
                        </span>
                      </div>
                    </div>

                    {/* 用户信息 */}
                    <div className="col-span-6">
                      <div className="flex items-center gap-3">
                        {/* 头像 */}
                        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex-shrink-0">
                          {entry.avatar ? (
                            <img
                              src={entry.avatar}
                              alt={entry.username}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400 font-bold">
                              {entry.username.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>

                        {/* 用户名和会员标识 */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900 dark:text-white truncate">
                              {entry.username}
                            </span>
                            {entry.membershipTier !== 'FREE' && (
                              <span
                                className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                                  getMembershipBadge(entry.membershipTier)?.color
                                }`}
                              >
                                {getMembershipBadge(entry.membershipTier)?.label}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 积分 */}
                    <div className="col-span-4 text-right">
                      <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                        <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="font-bold text-blue-600 dark:text-blue-400">
                          {entry.totalPoints}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 说明文字 */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-sm text-blue-800 dark:text-blue-200">
          <p className="font-medium mb-2">💡 积分规则：</p>
          <ul className="space-y-1 ml-4">
            <li>• 完全猜对比分：获得 <strong>10分</strong></li>
            <li>• 猜对输赢和比分差：获得 <strong>7分</strong></li>
            <li>• 只猜对输赢：获得 <strong>3分</strong></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
