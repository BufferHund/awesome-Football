import { useState, useEffect } from 'react';
import { Trophy, Users, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { predictionService, PredictionStats } from '../services/predictionService';

interface Match {
  id: number;
  homeTeam: { name: string; logo?: string };
  awayTeam: { name: string; logo?: string };
  status: string;
  matchDate: string;
}

interface PredictionFormProps {
  match: Match;
  onSuccess?: () => void;
}

const PredictionForm: React.FC<PredictionFormProps> = ({ match, onSuccess }) => {
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<PredictionStats | null>(null);
  const [hasPredict, setHasPredict] = useState(false);

  useEffect(() => {
    loadStats();
    checkUserPrediction();
  }, [match.id]);

  const loadStats = async () => {
    try {
      const data = await predictionService.getMatchStats(match.id);
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const checkUserPrediction = async () => {
    if (!isAuthenticated) return;
    try {
      const predictions = await predictionService.getMyPredictions();
      const existing = predictions.find(p => p.matchId === match.id);
      setHasPredict(!!existing);
    } catch (error) {
      console.error('Failed to check prediction:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      showToast('请先登录后再预测', 'warning');
      return;
    }

    if (!user?.emailVerified) {
      showToast('请先验证邮箱后再预测', 'warning');
      return;
    }

    if (hasPredict) {
      showToast('您已经预测过这场比赛', 'info');
      return;
    }

    setLoading(true);
    try {
      let predictedWinner: 'HOME' | 'AWAY' | 'DRAW' = 'DRAW';
      if (homeScore > awayScore) predictedWinner = 'HOME';
      if (homeScore < awayScore) predictedWinner = 'AWAY';

      await predictionService.createPrediction({
        matchId: match.id,
        predictedHomeScore: homeScore,
        predictedAwayScore: awayScore,
        predictedWinner,
      });

      showToast('预测提交成功！', 'success');
      setHasPredict(true);
      loadStats();
      onSuccess?.();
    } catch (error: any) {
      showToast(error.response?.data?.error || '预测提交失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getWinPercentage = (count: number) => {
    if (!stats || stats.total === 0) return 0;
    return Math.round((count / stats.total) * 100);
  };

  // 检查比赛是否可以预测
  const canPredict = match.status === 'SCHEDULED' && new Date(match.matchDate) > new Date();

  if (!canPredict) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-6 text-center">
        <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
        <p className="text-yellow-800 dark:text-yellow-200 font-medium">
          该比赛已开始或结束，无法进行预测
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-6 h-6 text-yellow-500" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">趣味猜球</h3>
      </div>

      {/* 预测统计 */}
      {stats && stats.total > 0 && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {stats.total} 人已预测
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {getWinPercentage(stats.homeWin)}%
              </div>
              <div className="text-xs text-gray-500">主胜</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {getWinPercentage(stats.draw)}%
              </div>
              <div className="text-xs text-gray-500">平局</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {getWinPercentage(stats.awayWin)}%
              </div>
              <div className="text-xs text-gray-500">客胜</div>
            </div>
          </div>
        </div>
      )}

      {/* 预测表单 */}
      {hasPredict ? (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
            <Trophy className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            您已完成预测！
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            比赛结束后将自动计算积分
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between gap-4 mb-6">
            {/* 主队 */}
            <div className="flex-1 text-center">
              {match.homeTeam.logo && (
                <img
                  src={match.homeTeam.logo}
                  alt={match.homeTeam.name}
                  className="w-16 h-16 mx-auto mb-2 object-contain"
                />
              )}
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                {match.homeTeam.name}
              </p>
              <input
                type="number"
                min="0"
                max="20"
                value={homeScore}
                onChange={(e) => setHomeScore(parseInt(e.target.value) || 0)}
                className="w-20 h-14 text-center text-2xl font-bold border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                required
              />
            </div>

            {/* VS */}
            <div className="text-2xl font-bold text-gray-400">VS</div>

            {/* 客队 */}
            <div className="flex-1 text-center">
              {match.awayTeam.logo && (
                <img
                  src={match.awayTeam.logo}
                  alt={match.awayTeam.name}
                  className="w-16 h-16 mx-auto mb-2 object-contain"
                />
              )}
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                {match.awayTeam.name}
              </p>
              <input
                type="number"
                min="0"
                max="20"
                value={awayScore}
                onChange={(e) => setAwayScore(parseInt(e.target.value) || 0)}
                className="w-20 h-14 text-center text-2xl font-bold border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                required
              />
            </div>
          </div>

          {/* 积分说明 */}
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-900 dark:text-blue-300">
                积分规则
              </span>
            </div>
            <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
              <li>• 完全猜对比分：<strong>10分</strong></li>
              <li>• 猜对输赢和比分差：<strong>7分</strong></li>
              <li>• 只猜对输赢：<strong>3分</strong></li>
            </ul>
          </div>

          {/* 提交按钮 */}
          <button
            type="submit"
            disabled={loading || !isAuthenticated}
            className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '提交中...' : isAuthenticated ? '提交预测' : '请先登录'}
          </button>
        </form>
      )}
    </div>
  );
};

export default PredictionForm;
