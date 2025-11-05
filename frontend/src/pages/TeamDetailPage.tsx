import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { teamService } from '../services/api';
import { MapPin, Calendar, Users } from 'lucide-react';

const TeamDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadTeam(parseInt(id));
    }
  }, [id]);

  const loadTeam = async (teamId: number) => {
    try {
      const response = await teamService.getById(teamId);
      setTeam(response.data);
    } catch (error) {
      console.error('加载球队详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="card p-12 text-center">
        <p className="text-gray-500 text-lg">球队不存在</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 球队信息 */}
      <div className="card p-8">
        <div className="flex items-start space-x-6 mb-6">
          {team.logo && (
            <img src={team.logo} alt={team.name} className="w-32 h-32 object-contain" />
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{team.name}</h1>
            <p className="text-xl text-gray-600 mb-4">{team.shortName}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{team.country}</span>
              </div>
              {team.founded && (
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>成立于 {team.founded}</span>
                </div>
              )}
              {team.stadium && (
                <div className="flex items-center text-gray-600 col-span-2">
                  <Users className="w-4 h-4 mr-2" />
                  <span>主场: {team.stadium}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 球员列表 */}
      {team.players && team.players.length > 0 && (
        <div className="card p-6">
          <h2 className="text-2xl font-bold mb-4">球员名单</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {team.players.map((player: any) => (
              <div key={player.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                {player.photo && (
                  <img src={player.photo} alt={player.name} className="w-16 h-16 rounded-full" />
                )}
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold">{player.name}</span>
                    {player.number && (
                      <span className="badge bg-green-100 text-green-800">#{player.number}</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    <span>{player.position}</span>
                    <span className="mx-2">•</span>
                    <span>{player.nationality}</span>
                    {player.age && (
                      <>
                        <span className="mx-2">•</span>
                        <span>{player.age}岁</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 最近比赛 */}
      {(team.homeMatches?.length > 0 || team.awayMatches?.length > 0) && (
        <div className="card p-6">
          <h2 className="text-2xl font-bold mb-4">最近比赛</h2>
          <div className="space-y-3">
            {[...team.homeMatches, ...team.awayMatches]
              .sort((a: any, b: any) => new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime())
              .slice(0, 5)
              .map((match: any) => (
                <div key={match.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-semibold">{match.competition}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(match.matchDate).toLocaleDateString('zh-CN')}
                    </div>
                  </div>
                  <div className="text-center px-4">
                    <div className="font-bold text-lg">
                      {match.homeScore ?? '-'} : {match.awayScore ?? '-'}
                    </div>
                    <div className="badge badge-finished text-xs mt-1">{match.status}</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamDetailPage;
