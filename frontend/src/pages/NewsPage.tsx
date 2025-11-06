import { useEffect, useState } from 'react';
import { News } from '../types';
import { newsService, scraperService } from '../services/api';
import NewsCard from '../components/NewsCard';
import { Newspaper, Database, Globe, Target } from 'lucide-react';

type NewsSource = 'database' | 'espn' | 'goal';

const NewsPage = () => {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSource, setSelectedSource] = useState<NewsSource>('database');
  const [scraping, setScraping] = useState(false);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    setLoading(true);
    try {
      const response = await newsService.getAll({ limit: 20 });
      setNews(response.data);
    } catch (error) {
      console.error('加载新闻失败:', error);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  const scrapeNews = async (source: 'espn' | 'goal') => {
    setScraping(true);
    setSelectedSource(source);
    try {
      let response;
      switch (source) {
        case 'espn':
          response = await scraperService.scrapeESPNNews();
          break;
        case 'goal':
          response = await scraperService.scrapeGoalNews();
          break;
      }

      // 后端返回格式: { data: [...], count: N, success: true }
      const newsData = response.data.data || [];

      // 转换爬虫数据格式为统一格式
      const scrapedNews = newsData.map((item: any, index: number) => ({
        id: `scraped-${source}-${index}`,
        title: item.title,
        summary: item.description || item.summary || '',
        content: item.description || item.summary || '',
        coverImage: item.image || item.imageUrl || item.coverImage || null,
        category: source.toUpperCase(),
        author: item.author || source.toUpperCase(),
        publishDate: item.publishDate || item.date || new Date().toISOString(),
        views: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // 保留外部URL以便打开原网站
        externalUrl: item.url || null,
      }));

      setNews(scrapedNews);
    } catch (error) {
      console.error(`从${source.toUpperCase()}爬取新闻失败:`, error);
      setNews([]);
    } finally {
      setScraping(false);
    }
  };

  const sourceOptions = [
    { value: 'database', label: '本地数据库', icon: Database, gradient: 'from-green-500 to-emerald-600' },
    { value: 'espn', label: 'ESPN', icon: Globe, gradient: 'from-red-500 to-pink-500' },
    { value: 'goal', label: 'Goal.com', icon: Globe, gradient: 'from-blue-500 to-indigo-600' },
  ] as const;

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-700 dark:via-indigo-700 dark:to-purple-700 rounded-3xl p-8 text-white overflow-hidden shadow-2xl shadow-blue-500/20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
            <Newspaper className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight drop-shadow-lg">足坛资讯</h1>
            <p className="text-white/90 text-base md:text-lg font-medium mt-1">最新动态 · 深度报道 · 独家分析</p>
          </div>
        </div>
      </div>

      {/* 数据源选择 - 专业体育平台风格 */}
      <div className="bg-white dark:bg-dark-200 rounded-2xl p-6 shadow-lg border-2 border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <Database className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900 dark:text-white">数据源选择</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">从不同平台获取足球资讯</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {sourceOptions.map(({ value, label, icon: Icon, gradient }) => (
            <button
              key={value}
              onClick={() => {
                if (value === 'database') {
                  setSelectedSource('database');
                  loadNews();
                } else {
                  scrapeNews(value as 'espn' | 'goal');
                }
              }}
              disabled={loading || scraping}
              className={`
                flex items-center gap-3 px-6 py-3.5 rounded-xl font-bold transition-all duration-200
                ${selectedSource === value
                  ? `bg-gradient-to-r ${gradient} text-white shadow-xl scale-105`
                  : 'bg-gray-100 dark:bg-dark-300 text-gray-700 dark:text-gray-300 hover:scale-105 shadow-md'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Loading状态 */}
      {(loading || scraping) && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 font-bold text-lg">
              {scraping ? `正在从 ${selectedSource.toUpperCase()} 获取新闻...` : '加载中...'}
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">请稍候</p>
          </div>
        </div>
      )}

      {/* 新闻列表 */}
      {!loading && !scraping && (
        <>
          {news.length > 0 ? (
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Newspaper className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white">新闻列表</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">共 {news.length} 条资讯</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {news.map((item) => (
                  <NewsCard key={item.id} news={item} />
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-dark-200 rounded-2xl p-16 text-center shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="w-24 h-24 bg-gray-100 dark:bg-dark-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-xl font-bold mb-2">暂无新闻</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm">请尝试从其他数据源获取新闻</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NewsPage;
