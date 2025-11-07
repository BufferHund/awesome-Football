import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Match } from '../types';
import { matchService } from '../services/api';
import { MapPin, Calendar, Trophy } from 'lucide-react';
import PredictionForm from '../components/PredictionForm';

const MatchDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadMatch(parseInt(id));
    }
  }, [id]);

  const loadMatch = async (matchId: number) => {
    try {
      const response = await matchService.getById(matchId);
      setMatch(response.data);
    } catch (error) {
      console.error('加载比赛详情失败:', error);
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

  if (!match) {
    return (
      <div className="card p-12 text-center">
        <p className="text-gray-500 text-lg">比赛不存在</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 比赛头部 */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-green-600" />
            <span className="font-semibold">{match.competition}</span>
            {match.round && <span className="text-gray-500">• {match.round}</span>}
          </div>
          {match.status === 'LIVE' && (
            <span className="badge badge-live">直播中</span>
          )}
        </div>

        <div className="grid grid-cols-[1fr,auto,1fr] gap-8 items-center py-8">
          {/* 主队 */}
          <div className="text-center">
            {match.homeTeam.logo && (
              <img
                src={match.homeTeam.logo}
                alt={match.homeTeam.name}
                className="w-24 h-24 mx-auto mb-4"
              />
            )}
            <h2 className="text-2xl font-bold">{match.homeTeam.name}</h2>
          </div>

          {/* 比分 */}
          <div className="text-center px-8">
            {match.status === 'SCHEDULED' ? (
              <div className="text-lg text-gray-600">VS</div>
            ) : (
              <div className="text-5xl font-bold text-green-600">
                {match.homeScore ?? 0} - {match.awayScore ?? 0}
              </div>
            )}
          </div>

          {/* 客队 */}
          <div className="text-center">
            {match.awayTeam.logo && (
              <img
                src={match.awayTeam.logo}
                alt={match.awayTeam.name}
                className="w-24 h-24 mx-auto mb-4"
              />
            )}
            <h2 className="text-2xl font-bold">{match.awayTeam.name}</h2>
          </div>
        </div>

        <div className="border-t pt-4 space-y-2 text-sm text-gray-600">
          <div className="flex items-center justify-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(match.matchDate)}</span>
          </div>
          {match.venue && (
            <div className="flex items-center justify-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>{match.venue}</span>
            </div>
          )}
        </div>
      </div>

      {/* 比赛事件 */}
      {match.events && match.events.length > 0 && (
        <div className="card p-6">
          <h3 className="text-xl font-bold mb-4">比赛事件</h3>
          <div className="space-y-3">
            {match.events.map((event) => (
              <div key={event.id} className="flex items-center space-x-4 py-2 border-b last:border-b-0">
                <span className="font-bold text-green-600 w-12">{event.minute}'</span>
                <div className="flex-1">
                  <div className="font-semibold">{event.player}</div>
                  <div className="text-sm text-gray-600">
                    {event.type === 'GOAL' && '⚽ 进球'}
                    {event.type === 'CARD' && '🟨 黄牌'}
                    {event.type === 'SUBSTITUTION' && '🔄 换人'}
                    {event.detail && ` • ${event.detail}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 趣味猜球 */}
      <PredictionForm match={match} />
    </div>
  );
};

export default MatchDetailPage;
