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
    <div className="space-y-16 max-w-7xl mx-auto">
      {/* Hero Section - The Verge极简风格 */}
      <div className="py-12 md:py-20 border-b border-gray-200 dark:border-gray-800">
        <div className="mb-6">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            实时足球资讯
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight leading-none">
          懂球帝
        </h1>

        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl leading-relaxed">
          全球球迷聚集地，提供实时比分、赛事直播、战术分析、球员数据和转会动态。
        </p>

        <div className="flex flex-wrap gap-4">
          <Link
            to="/matches"
            className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-black font-medium hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors"
          >
            查看赛事
          </Link>
          <Link
            to="/membership"
            className="px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-medium hover:border-gray-900 dark:hover:border-white transition-colors"
          >
            会员特权
          </Link>
        </div>
      </div>

      {/* 直播中的比赛 */}
      {liveMatches.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200 dark:border-gray-800">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">正在直播</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">实时比分更新</p>
            </div>
            <Link to="/matches" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              查看全部 →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {liveMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </section>
      )}

      {/* 今日比赛 */}
      <section>
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">今日赛事</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">精彩对决不容错过</p>
          </div>
          <Link to="/matches" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            查看全部 →
          </Link>
        </div>
        {todayMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {todayMatches.slice(0, 4).map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border border-gray-200 dark:border-gray-800">
            <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">今日暂无比赛</p>
          </div>
        )}
      </section>

      {/* 最新新闻 */}
      <section>
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">足坛资讯</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">最新动态抢先看</p>
          </div>
          <Link to="/news" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            查看全部 →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestNews.map((news) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>
      </section>

      {/* 快捷入口 */}
      <section className="pb-12">
        <div className="mb-8 pb-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">快速导航</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">一键直达功能区</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Link to="/shop" className="group border border-gray-200 dark:border-gray-800 p-6 hover:border-gray-900 dark:hover:border-white transition-colors">
            <ShoppingBag className="w-8 h-8 text-gray-900 dark:text-white mb-4" />
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">球迷商城</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">会员享95折优惠</p>
          </Link>
          <Link to="/teams" className="group border border-gray-200 dark:border-gray-800 p-6 hover:border-gray-900 dark:hover:border-white transition-colors">
            <Users className="w-8 h-8 text-gray-900 dark:text-white mb-4" />
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">球队数据</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">浏览球队信息</p>
          </Link>
          <Link to="/matches" className="group border border-gray-200 dark:border-gray-800 p-6 hover:border-gray-900 dark:hover:border-white transition-colors">
            <Trophy className="w-8 h-8 text-gray-900 dark:text-white mb-4" />
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">赛程赛果</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">完整比赛日程</p>
          </Link>
          <Link to="/news" className="group border border-gray-200 dark:border-gray-800 p-6 hover:border-gray-900 dark:hover:border-white transition-colors">
            <Newspaper className="w-8 h-8 text-gray-900 dark:text-white mb-4" />
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">新闻资讯</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">最新足球资讯</p>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
