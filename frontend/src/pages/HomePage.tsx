import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Match, News } from '../types';
import { matchService, newsService } from '../services/api';
import MatchCard from '../components/MatchCard';
import NewsCard from '../components/NewsCard';
import { TrendingUp, Newspaper, ChevronRight } from 'lucide-react';

const HomePage = () => {
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [todayMatches, setTodayMatches] = useState<Match[]>([]);
  const [latestNews, setLatestNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [liveRes, todayRes, newsRes] = await Promise.all([
        matchService.getLive(),
        matchService.getToday(),
        newsService.getAll({ limit: 4 }),
      ]);

      setLiveMatches(liveRes.data);
      setTodayMatches(todayRes.data);
      setLatestNews(newsRes.data);
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 欢迎横幅 */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-8 text-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">欢迎来到足球世界</h1>
        <p className="text-green-100 text-lg">最新赛事、即时比分、球队资讯一网打尽</p>
      </div>

      {/* 直播中的比赛 */}
      {liveMatches.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-red-500" />
              正在直播
            </h2>
            <Link to="/matches" className="text-green-600 hover:text-green-700 flex items-center">
              查看更多 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {liveMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </section>
      )}

      {/* 今日比赛 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">今日赛事</h2>
          <Link to="/matches" className="text-green-600 hover:text-green-700 flex items-center">
            查看全部 <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        {todayMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {todayMatches.slice(0, 4).map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center text-gray-500">
            今日暂无比赛
          </div>
        )}
      </section>

      {/* 最新新闻 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold flex items-center">
            <Newspaper className="w-6 h-6 mr-2 text-green-600" />
            最新资讯
          </h2>
          <Link to="/news" className="text-green-600 hover:text-green-700 flex items-center">
            查看更多 <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {latestNews.map((news) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>
      </section>

      {/* 快捷入口 */}
      <section>
        <h2 className="text-2xl font-bold mb-4">快速导航</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/standings" className="card p-6 text-center hover:shadow-xl transition-shadow">
            <TrendingUp className="w-12 h-12 mx-auto mb-2 text-green-600" />
            <h3 className="font-semibold">积分榜</h3>
            <p className="text-sm text-gray-500 mt-1">查看各大联赛排名</p>
          </Link>
          <Link to="/teams" className="card p-6 text-center hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-2">🏆</div>
            <h3 className="font-semibold">球队</h3>
            <p className="text-sm text-gray-500 mt-1">浏览球队信息</p>
          </Link>
          <Link to="/matches" className="card p-6 text-center hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-2">⚽</div>
            <h3 className="font-semibold">赛程</h3>
            <p className="text-sm text-gray-500 mt-1">完整比赛日程</p>
          </Link>
          <Link to="/news" className="card p-6 text-center hover:shadow-xl transition-shadow">
            <Newspaper className="w-12 h-12 mx-auto mb-2 text-green-600" />
            <h3 className="font-semibold">新闻</h3>
            <p className="text-sm text-gray-500 mt-1">最新足球资讯</p>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
