import { useEffect, useState } from 'react';
import { Match } from '../types';
import { matchService } from '../services/api';
import MatchCard from '../components/MatchCard';

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

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">比赛中心</h1>

      {/* 过滤器 */}
      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all'
              ? 'bg-green-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          全部比赛
        </button>
        <button
          onClick={() => setFilter('live')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'live'
              ? 'bg-green-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          直播中
        </button>
        <button
          onClick={() => setFilter('today')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'today'
              ? 'bg-green-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          今日比赛
        </button>
      </div>

      {/* 比赛列表 */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : matches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <p className="text-gray-500 text-lg">暂无比赛数据</p>
        </div>
      )}
    </div>
  );
};

export default MatchesPage;
