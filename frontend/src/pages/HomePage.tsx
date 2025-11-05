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
    <div className="space-y-8">
      {/* 欢迎横幅 - 扁平化设计 */}
      <div className="bg-gradient-to-br from-primary-500 via-primary-600 to-purple-600 dark:from-primary-600 dark:via-primary-700 dark:to-purple-700 rounded-2xl p-8 md:p-12 text-white animate-fade-in relative overflow-hidden">
        {/* 装饰性元素 */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full blur-2xl"></div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg mb-4">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-sm font-medium">欢迎访问</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">足球世界</h1>
          <p className="text-white/80 text-base md:text-lg mb-8 max-w-2xl font-light">
            最新赛事、即时比分、球队资讯一网打尽
          </p>

          {/* CTA按钮组 */}
          <div className="flex flex-wrap gap-3">
            <Link
              to="/membership"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-primary-600 font-medium rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              <Crown className="w-4 h-4" />
              <span>开通会员</span>
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium rounded-lg hover:bg-white/20 transition-all duration-200"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>球迷商城</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 直播中的比赛 */}
      {liveMatches.length > 0 && (
        <section className="animate-slide-up">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-red-500 rounded-full"></div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">正在直播</h2>
            </div>
            <Link to="/matches" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-1 font-medium transition-colors">
              查看更多 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {liveMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </section>
      )}

      {/* 今日比赛 */}
      <section className="animate-slide-up">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-primary-500 rounded-full"></div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">今日赛事</h2>
          </div>
          <Link to="/matches" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-1 font-medium transition-colors">
            查看全部 <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        {todayMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {todayMatches.slice(0, 4).map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center text-gray-500 dark:text-gray-400">
            今日暂无比赛
          </div>
        )}
      </section>

      {/* 最新新闻 */}
      <section className="animate-slide-up">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">最新资讯</h2>
          </div>
          <Link to="/news" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-1 font-medium transition-colors">
            查看更多 <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {latestNews.map((news) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>
      </section>

      {/* 快捷入口 */}
      <section className="animate-slide-up">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">快速导航</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link to="/shop" className="card card-hover p-5 text-center group">
            <ShoppingBag className="w-10 h-10 mx-auto mb-3 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">球迷商城</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">会员享95折优惠</p>
          </Link>
          <Link to="/teams" className="card card-hover p-5 text-center group">
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🏆</div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">球队</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">浏览球队信息</p>
          </Link>
          <Link to="/matches" className="card card-hover p-5 text-center group">
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">⚽</div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">赛程</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">完整比赛日程</p>
          </Link>
          <Link to="/news" className="card card-hover p-5 text-center group">
            <Newspaper className="w-10 h-10 mx-auto mb-3 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">新闻</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">最新足球资讯</p>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
