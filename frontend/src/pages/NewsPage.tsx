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
    { value: 'database', label: '本地数据库' },
    { value: 'espn', label: 'ESPN' },
    { value: 'goal', label: 'Goal.com' },
  ] as const;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 页面标题 */}
      <div className="flex items-center justify-between py-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
          足坛资讯
        </h1>
      </div>

      {/* 数据源选择 */}
      <div className="flex flex-wrap gap-3">
        {sourceOptions.map(({ value, label }) => (
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
              px-4 py-2 text-sm font-medium transition-colors
              ${selectedSource === value
                ? 'bg-gray-900 dark:bg-white text-white dark:text-black'
                : 'border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:border-gray-900 dark:hover:border-white'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Loading状态 */}
      {(loading || scraping) && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-2 border-gray-900 dark:border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              {scraping ? `正在从 ${selectedSource.toUpperCase()} 获取新闻...` : '加载中...'}
            </p>
          </div>
        </div>
      )}

      {/* 新闻列表 */}
      {!loading && !scraping && (
        <>
          {news.length > 0 ? (
            <div>
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  新闻列表 <span className="text-sm font-normal text-gray-500 dark:text-gray-400">({news.length})</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {news.map((item) => (
                  <NewsCard key={item.id} news={item} />
                ))}
              </div>
            </div>
          ) : (
            <div className="py-20 text-center border border-gray-200 dark:border-gray-800">
              <Newspaper className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-2">暂无新闻</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">请尝试从其他数据源获取新闻</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NewsPage;
