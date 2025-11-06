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
    { value: 'all', label: '全部赛事', icon: Trophy, gradient: 'from-green-500 to-emerald-600' },
    { value: 'live', label: '直播中', icon: Flame, gradient: 'from-red-500 to-pink-500' },
    { value: 'today', label: '今日比赛', icon: Calendar, gradient: 'from-blue-500 to-indigo-600' },
  ] as const;

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="relative bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 dark:from-green-700 dark:via-emerald-700 dark:to-teal-700 rounded-3xl p-8 text-white overflow-hidden shadow-2xl shadow-green-500/20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight drop-shadow-lg">赛事中心</h1>
            <p className="text-white/90 text-base md:text-lg font-medium mt-1">实时比分 · 赛程赛果 · 数据统计</p>
          </div>
        </div>
      </div>

      {/* 过滤器 - 专业体育平台风格 */}
      <div className="flex flex-wrap gap-3">
        {filterOptions.map(({ value, label, icon: Icon, gradient }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`
              relative flex items-center gap-3 px-6 py-3.5 rounded-xl font-bold transition-all duration-200
              ${filter === value
                ? `bg-gradient-to-r ${gradient} text-white shadow-xl scale-105`
                : 'bg-white dark:bg-dark-200 text-gray-700 dark:text-gray-300 hover:scale-105 shadow-lg border-2 border-gray-200 dark:border-gray-700'
              }
            `}
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
            {filter === value && value === 'live' && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></span>
            )}
          </button>
        ))}
      </div>

      {/* 比赛列表 */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">加载中...</p>
          </div>
        </div>
      ) : matches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-dark-200 rounded-2xl p-16 text-center shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="w-24 h-24 bg-gray-100 dark:bg-dark-300 rounded-full flex items-center justify-center mx-auto mb-6">
            <Target className="w-12 h-12 text-gray-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-xl font-bold mb-2">暂无比赛数据</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm">请稍后再试或选择其他筛选条件</p>
        </div>
      )}
    </div>
  );
};

export default MatchesPage;
