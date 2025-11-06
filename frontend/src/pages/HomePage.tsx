import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Match, News } from '../types';
import { matchService, newsService } from '../services/api';
import MatchCard from '../components/MatchCard';
import NewsCard from '../components/NewsCard';
import { TrendingUp, Newspaper, ChevronRight, ShoppingBag, Sparkles, Crown, Flame, Zap, Users, Trophy, Target } from 'lucide-react';

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
      <div className="space-y-6">
        {/* 骨架屏 - 横幅 */}
        <div className="skeleton h-48 rounded-2xl"></div>

        {/* 骨架屏 - 卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-32 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero Section - 精简版 */}
      <div className="py-6 md:py-8">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight leading-none">
          懂球帝
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 max-w-2xl">
          全球球迷聚集地，实时比分、赛事直播、战术分析
        </p>

        <Link
          to="/matches"
          className="inline-block px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-black text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors"
        >
          查看赛事
        </Link>
      </div>

      {/* 直播中的比赛 */}
      {liveMatches.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">正在直播</h2>
            <Link to="/matches" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              查看全部 →
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">今日赛事</h2>
          <Link to="/matches" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            查看全部 →
          </Link>
        </div>
        {todayMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {todayMatches.slice(0, 4).map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center border border-gray-200 dark:border-gray-800">
            <Trophy className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400 text-sm">今日暂无比赛</p>
          </div>
        )}
      </section>

      {/* 最新新闻 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">足坛资讯</h2>
          <Link to="/news" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            查看全部 →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {latestNews.map((news) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
