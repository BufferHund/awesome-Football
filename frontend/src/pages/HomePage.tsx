import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Match, News } from '../types';
import { matchService, newsService } from '../services/api';
import MatchCard from '../components/MatchCard';
import NewsCard from '../components/NewsCard';
import { TrendingUp, Newspaper, ChevronRight, ShoppingBag, Sparkles, Crown } from 'lucide-react';

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 欢迎横幅 */}
      <div className="hero-gradient rounded-3xl p-8 md:p-12 text-white shadow-2xl animate-fade-in relative overflow-hidden">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>

        {/* 装饰性元素 */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-500/20 rounded-full blur-2xl"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
            <h1 className="text-3xl md:text-5xl font-bold drop-shadow-lg">欢迎来到足球世界</h1>
          </div>
          <p className="text-white/90 text-lg md:text-xl mb-6 max-w-2xl">
            最新赛事、即时比分、球队资讯一网打尽
          </p>

          {/* CTA按钮组 */}
          <div className="flex flex-wrap gap-4">
            <Link
              to="/membership"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <Crown className="w-5 h-5" />
              <span>开通会员</span>
            </Link>
            <Link
              to="/shop"
              className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm border-2 border-white/50 text-white font-semibold rounded-xl hover:bg-white/30 hover:scale-105 transition-all duration-300"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>球迷商城</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 直播中的比赛 */}
      {liveMatches.length > 0 && (
        <section className="animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center text-gray-900 dark:text-gray-100">
              <TrendingUp className="w-6 h-6 mr-2 text-red-500 dark:text-red-400" />
              正在直播
            </h2>
            <Link to="/matches" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center font-medium transition-colors">
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
      <section className="animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">今日赛事</h2>
          <Link to="/matches" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center font-medium transition-colors">
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
          <div className="glass-card p-8 text-center text-gray-500 dark:text-gray-400">
            今日暂无比赛
          </div>
        )}
      </section>

      {/* 最新新闻 */}
      <section className="animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold flex items-center text-gray-900 dark:text-gray-100">
            <Newspaper className="w-6 h-6 mr-2 text-primary-600 dark:text-primary-400" />
            最新资讯
          </h2>
          <Link to="/news" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center font-medium transition-colors">
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
      <section className="animate-slide-up">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">快速导航</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/shop" className="glass-card p-6 text-center hover-lift group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-2xl"></div>
            <ShoppingBag className="w-12 h-12 mx-auto mb-2 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform relative z-10" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 relative z-10">球迷商城</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 relative z-10">会员享95折优惠</p>
          </Link>
          <Link to="/teams" className="glass-card p-6 text-center hover-lift group">
            <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">🏆</div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">球队</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">浏览球队信息</p>
          </Link>
          <Link to="/matches" className="glass-card p-6 text-center hover-lift group">
            <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">⚽</div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">赛程</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">完整比赛日程</p>
          </Link>
          <Link to="/news" className="glass-card p-6 text-center hover-lift group">
            <Newspaper className="w-12 h-12 mx-auto mb-2 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">新闻</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">最新足球资讯</p>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
