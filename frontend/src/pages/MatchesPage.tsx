import { useEffect, useState } from 'react';
import { Match } from '../types';
import { matchService } from '../services/api';
import MatchCard from '../components/MatchCard';
import { Trophy, Flame, Calendar, Target } from 'lucide-react';

const MatchesPage = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'live' | 'today'>('all');

  useEffect(() => {
    loadMatches();
  }, [filter]);

  const loadMatches = async () => {
    setLoading(true);
    try {
      let response;
      switch (filter) {
        case 'live':
          response = await matchService.getLive();
          break;
        case 'today':
          response = await matchService.getToday();
          break;
        default:
          response = await matchService.getAll();
      }
      setMatches(response.data);
    } catch (error) {
      console.error('加载比赛失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOptions = [
    { value: 'all', label: '全部赛事' },
    { value: 'live', label: '直播中' },
    { value: 'today', label: '今日比赛' },
  ] as const;

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      {/* 页面标题 */}
      <div className="py-8 border-b border-gray-200 dark:border-gray-800">
        <div className="mb-4">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Match Center
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
          赛事中心
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          实时比分 · 赛程赛果 · 数据统计
        </p>
      </div>

      {/* 过滤器 - The Verge极简风格 */}
      <div className="flex flex-wrap gap-3 border-b border-gray-200 dark:border-gray-800 pb-6">
        {filterOptions.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`
              px-4 py-2 font-medium transition-colors
              ${filter === value
                ? 'bg-gray-900 dark:bg-white text-white dark:text-black'
                : 'border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:border-gray-900 dark:hover:border-white'
              }
            `}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 比赛列表 */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-2 border-gray-900 dark:border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">加载中...</p>
          </div>
        </div>
      ) : matches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border border-gray-200 dark:border-gray-800">
          <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-2">暂无比赛数据</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">请稍后再试或选择其他筛选条件</p>
        </div>
      )}
    </div>
  );
};

export default MatchesPage;
