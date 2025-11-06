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
    <div className="space-y-6">
      {/* 欢迎横幅 - 专业体育平台风格 */}
      <div className="relative bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 dark:from-green-700 dark:via-emerald-700 dark:to-teal-700 rounded-3xl p-8 md:p-12 text-white animate-fade-in overflow-hidden shadow-2xl shadow-green-500/20">
        {/* 足球场纹理背景 */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>

        {/* 装饰性球形元素 */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-yellow-400/20 rounded-full blur-2xl"></div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-xl mb-6 shadow-lg">
            <Flame className="w-5 h-5 text-yellow-300" />
            <span className="text-sm font-bold tracking-wide">实时足球资讯平台</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tight drop-shadow-2xl">
            懂球帝
          </h1>
          <p className="text-white/90 text-lg md:text-2xl mb-3 font-bold tracking-wide">
            全球球迷聚集地
          </p>
          <p className="text-white/70 text-base md:text-lg mb-8 max-w-2xl font-medium">
            实时比分 · 赛事直播 · 战术分析 · 球员数据 · 转会动态
          </p>

          {/* 数据展示 */}
          <div className="flex flex-wrap gap-6 mb-8">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-lg">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-black">500万+</div>
                <div className="text-xs text-white/80 font-medium">活跃球迷</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-lg">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-yellow-300" />
              </div>
              <div>
                <div className="text-2xl font-black">24/7</div>
                <div className="text-xs text-white/80 font-medium">实时更新</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-lg">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-yellow-300" />
              </div>
              <div>
                <div className="text-2xl font-black">100+</div>
                <div className="text-xs text-white/80 font-medium">联赛覆盖</div>
              </div>
            </div>
          </div>

          {/* CTA按钮组 */}
          <div className="flex flex-wrap gap-4">
            <Link
              to="/membership"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-white font-black rounded-xl shadow-xl shadow-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/40 hover:scale-105 transition-all duration-200"
            >
              <Crown className="w-5 h-5" />
              <span>开通会员特权</span>
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/15 backdrop-blur-sm border-2 border-white/30 text-white font-black rounded-xl hover:bg-white/25 hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>球迷商城</span>
            </Link>
            <Link
              to="/forum"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/15 backdrop-blur-sm border-2 border-white/30 text-white font-black rounded-xl hover:bg-white/25 hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <Target className="w-5 h-5" />
              <span>懂球圈</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 直播中的比赛 */}
      {liveMatches.length > 0 && (
        <section className="animate-slide-up">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">正在直播</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">实时比分更新</p>
              </div>
            </div>
            <Link to="/matches" className="text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 flex items-center gap-1 font-bold transition-colors hover:scale-105">
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
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">今日赛事</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">精彩对决不容错过</p>
            </div>
          </div>
          <Link to="/matches" className="text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 flex items-center gap-1 font-bold transition-colors hover:scale-105">
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
          <div className="bg-white dark:bg-dark-200 rounded-2xl p-12 text-center shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="w-20 h-20 bg-gray-100 dark:bg-dark-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">今日暂无比赛</p>
          </div>
        )}
      </section>

      {/* 最新新闻 */}
      <section className="animate-slide-up">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Newspaper className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">足坛资讯</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">最新动态抢先看</p>
            </div>
          </div>
          <Link to="/news" className="text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 flex items-center gap-1 font-bold transition-colors hover:scale-105">
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
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">快速导航</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">一键直达功能区</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/shop" className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-center group hover:scale-105 transition-all duration-200 shadow-xl shadow-orange-500/20 hover:shadow-2xl hover:shadow-orange-500/30">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-black text-white text-base mb-1">球迷商城</h3>
            <p className="text-xs text-white/80 font-medium">会员享95折优惠</p>
          </Link>
          <Link to="/teams" className="bg-gradient-to-br from-yellow-500 to-amber-500 rounded-2xl p-6 text-center group hover:scale-105 transition-all duration-200 shadow-xl shadow-yellow-500/20 hover:shadow-2xl hover:shadow-yellow-500/30">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-black text-white text-base mb-1">球队数据</h3>
            <p className="text-xs text-white/80 font-medium">浏览球队信息</p>
          </Link>
          <Link to="/matches" className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-center group hover:scale-105 transition-all duration-200 shadow-xl shadow-green-500/20 hover:shadow-2xl hover:shadow-green-500/30">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-black text-white text-base mb-1">赛程赛果</h3>
            <p className="text-xs text-white/80 font-medium">完整比赛日程</p>
          </Link>
          <Link to="/news" className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-center group hover:scale-105 transition-all duration-200 shadow-xl shadow-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/30">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Newspaper className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-black text-white text-base mb-1">新闻资讯</h3>
            <p className="text-xs text-white/80 font-medium">最新足球资讯</p>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
