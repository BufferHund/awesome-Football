import { useEffect, useState } from 'react';
import { Standing } from '../types';
import { standingService } from '../services/api';

const StandingsPage = () => {
  const [standings, setStandings] = useState<Standing[]>([]);
  const [competitions, setCompetitions] = useState<string[]>([]);
  const [selectedCompetition, setSelectedCompetition] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompetitions();
  }, []);

  useEffect(() => {
    if (selectedCompetition) {
      loadStandings(selectedCompetition);
    }
  }, [selectedCompetition]);

  const loadCompetitions = async () => {
    try {
      const response = await standingService.getCompetitions();
      const comps = response.data;
      setCompetitions(comps);
      if (comps.length > 0) {
        setSelectedCompetition(comps[0]);
      }
    } catch (error) {
      console.error('加载联赛列表失败:', error);
    }
  };

  const loadStandings = async (competition: string) => {
    setLoading(true);
    try {
      const response = await standingService.getByCompetition(competition);
      setStandings(response.data);
    } catch (error) {
      console.error('加载积分榜失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">积分榜</h1>

      {/* 联赛选择器 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {competitions.map((comp) => (
          <button
            key={comp}
            onClick={() => setSelectedCompetition(comp)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCompetition === comp
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {comp}
          </button>
        ))}
      </div>

      {/* 积分榜表格 */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : standings.length > 0 ? (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">排名</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">球队</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">赛</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">胜</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">平</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">负</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">进球</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">失球</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">净胜球</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">积分</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">状态</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((standing) => (
                <tr key={standing.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <span
                      className={`font-bold ${
                        standing.position <= 4
                          ? 'text-green-600'
                          : standing.position <= 6
                          ? 'text-blue-600'
                          : standing.position >= standings.length - 2
                          ? 'text-red-600'
                          : ''
                      }`}
                    >
                      {standing.position}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-3">
                      {standing.team.logo && (
                        <img src={standing.team.logo} alt={standing.team.name} className="w-8 h-8" />
                      )}
                      <span className="font-medium">{standing.team.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">{standing.played}</td>
                  <td className="px-4 py-4 text-center">{standing.won}</td>
                  <td className="px-4 py-4 text-center">{standing.drawn}</td>
                  <td className="px-4 py-4 text-center">{standing.lost}</td>
                  <td className="px-4 py-4 text-center">{standing.goalsFor}</td>
                  <td className="px-4 py-4 text-center">{standing.goalsAgainst}</td>
                  <td className="px-4 py-4 text-center">
                    <span className={standing.goalDiff >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {standing.goalDiff >= 0 ? '+' : ''}{standing.goalDiff}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="font-bold text-green-600">{standing.points}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    {standing.form && (
                      <div className="flex space-x-1 justify-center">
                        {standing.form.split('').map((result, idx) => (
                          <span
                            key={idx}
                            className={`w-5 h-5 rounded-full text-xs flex items-center justify-center text-white font-bold ${
                              result === 'W'
                                ? 'bg-green-500'
                                : result === 'D'
                                ? 'bg-gray-400'
                                : 'bg-red-500'
                            }`}
                          >
                            {result}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card p-12 text-center">
          <p className="text-gray-500 text-lg">暂无积分榜数据</p>
        </div>
      )}
    </div>
  );
};

export default StandingsPage;
