import { Link } from 'react-router-dom';
import { Match } from '../types';
import { Clock, MapPin } from 'lucide-react';

interface MatchCardProps {
  match: Match;
}

const MatchCard = ({ match }: MatchCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      LIVE: <span className="badge badge-live">直播中</span>,
      SCHEDULED: <span className="badge badge-scheduled">未开始</span>,
      FINISHED: <span className="badge badge-finished">已结束</span>,
      POSTPONED: <span className="badge bg-yellow-100 text-yellow-800">延期</span>,
    };
    return badges[status as keyof typeof badges] || null;
  };

  return (
    <Link to={`/matches/${match.id}`} className="card p-4 block hover:scale-[1.02] transition-transform">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-600">{match.competition}</span>
          {match.round && <span className="text-xs text-gray-500">• {match.round}</span>}
        </div>
        {getStatusBadge(match.status)}
      </div>

      <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center">
        {/* 主队 */}
        <div className="flex flex-col items-end">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-lg text-right">{match.homeTeam.shortName}</span>
            {match.homeTeam.logo && (
              <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-10 h-10 object-contain" />
            )}
          </div>
        </div>

        {/* 比分或时间 */}
        <div className="text-center px-4">
          {match.status === 'SCHEDULED' ? (
            <div className="text-sm text-gray-600">
              <Clock className="w-4 h-4 mx-auto mb-1" />
              {formatDate(match.matchDate)}
            </div>
          ) : (
            <div className="text-3xl font-bold text-green-600">
              {match.homeScore ?? 0} - {match.awayScore ?? 0}
            </div>
          )}
        </div>

        {/* 客队 */}
        <div className="flex flex-col items-start">
          <div className="flex items-center space-x-2">
            {match.awayTeam.logo && (
              <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="w-10 h-10 object-contain" />
            )}
            <span className="font-semibold text-lg">{match.awayTeam.shortName}</span>
          </div>
        </div>
      </div>

      {match.venue && (
        <div className="flex items-center justify-center space-x-1 text-xs text-gray-500 mt-3">
          <MapPin className="w-3 h-3" />
          <span>{match.venue}</span>
        </div>
      )}
    </Link>
  );
};

export default MatchCard;
