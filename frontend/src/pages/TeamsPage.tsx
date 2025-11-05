import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Team } from '../types';
import { teamService } from '../services/api';
import { MapPin } from 'lucide-react';

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">球队</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => (
          <Link
            key={team.id}
            to={`/teams/${team.id}`}
            className="card p-6 hover:scale-[1.02] transition-transform"
          >
            <div className="flex items-start space-x-4">
              {team.logo && (
                <img src={team.logo} alt={team.name} className="w-16 h-16 object-contain" />
              )}
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">{team.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{team.shortName}</p>
                <div className="flex items-center text-xs text-gray-500 space-x-3">
                  <span className="flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {team.country}
                  </span>
                  {team.founded && <span>成立于 {team.founded}</span>}
                </div>
                {team.stadium && (
                  <p className="text-xs text-gray-500 mt-1">主场: {team.stadium}</p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TeamsPage;
