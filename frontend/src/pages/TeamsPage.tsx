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
          <div className="w-12 h-12 border-2 border-gray-900 dark:border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 页面标题 */}
      <div className="py-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
          球队数据
        </h1>
      </div>

      {/* 球队列表 */}
      {teams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => (
            <Link
              key={team.id}
              to={`/teams/${team.id}`}
              className="group border border-gray-200 dark:border-gray-800 p-6 hover:border-gray-900 dark:hover:border-white transition-colors"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-16 h-16 bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-2">
                  {team.logo ? (
                    <img src={team.logo} alt={team.name} className="w-full h-full object-contain" />
                  ) : (
                    <Shield className="w-8 h-8 text-gray-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 truncate">
                    {team.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{team.shortName}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{team.country}</span>
                </div>

                {team.founded && (
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4" />
                    <span>成立于 {team.founded}</span>
                  </div>
                )}

                {team.stadium && (
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    <span className="truncate">主场: {team.stadium}</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border border-gray-200 dark:border-gray-800">
          <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-2">暂无球队数据</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">请稍后再试</p>
        </div>
      )}
    </div>
  );
};

export default TeamsPage;
