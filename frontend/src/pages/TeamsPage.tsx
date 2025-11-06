import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Team } from '../types';
import { teamService } from '../services/api';
import { MapPin, Users, Trophy, Shield, Target } from 'lucide-react';

const TeamsPage = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      const response = await teamService.getAll();
      setTeams(response.data);
    } catch (error) {
      console.error('加载球队失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="relative bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-600 dark:from-yellow-600 dark:via-amber-600 dark:to-orange-700 rounded-3xl p-8 text-white overflow-hidden shadow-2xl shadow-amber-500/20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight drop-shadow-lg">球队数据</h1>
            <p className="text-white/90 text-base md:text-lg font-medium mt-1">球队信息 · 阵容分析 · 历史战绩</p>
          </div>
        </div>
      </div>

      {/* 球队列表 */}
      {teams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {teams.map((team) => (
            <Link
              key={team.id}
              to={`/teams/${team.id}`}
              className="group relative bg-white dark:bg-dark-200 rounded-2xl p-6 hover:scale-[1.03] transition-all duration-200 shadow-lg hover:shadow-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 overflow-hidden"
            >
              {/* 背景装饰 */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-300"></div>

              <div className="relative flex items-start gap-4">
                {/* 球队logo */}
                <div className="flex-shrink-0 w-20 h-20 bg-gray-100 dark:bg-dark-300 rounded-2xl flex items-center justify-center p-3 group-hover:scale-110 transition-transform duration-200 shadow-md">
                  {team.logo ? (
                    <img src={team.logo} alt={team.name} className="w-full h-full object-contain" />
                  ) : (
                    <Shield className="w-10 h-10 text-gray-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-xl mb-1 text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors truncate">
                    {team.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-bold mb-3">{team.shortName}</p>

                  <div className="space-y-2">
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 font-medium">
                      <div className="w-6 h-6 bg-gray-100 dark:bg-dark-300 rounded-lg flex items-center justify-center mr-2">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <span>{team.country}</span>
                    </div>

                    {team.founded && (
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 font-medium">
                        <div className="w-6 h-6 bg-gray-100 dark:bg-dark-300 rounded-lg flex items-center justify-center mr-2">
                          <Trophy className="w-3.5 h-3.5" />
                        </div>
                        <span>成立于 {team.founded}</span>
                      </div>
                    )}

                    {team.stadium && (
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 font-medium">
                        <div className="w-6 h-6 bg-gray-100 dark:bg-dark-300 rounded-lg flex items-center justify-center mr-2">
                          <Target className="w-3.5 h-3.5" />
                        </div>
                        <span className="truncate">主场: {team.stadium}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 查看详情提示 */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  查看详情
                </span>
                <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center group-hover:bg-green-500 transition-colors">
                  <svg className="w-3 h-3 text-green-600 dark:text-green-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-dark-200 rounded-2xl p-16 text-center shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="w-24 h-24 bg-gray-100 dark:bg-dark-300 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-12 h-12 text-gray-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-xl font-bold mb-2">暂无球队数据</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm">请稍后再试</p>
        </div>
      )}
    </div>
  );
};

export default TeamsPage;
