import { useEffect, useState } from 'react';
import { News } from '../types';
import { newsService, scraperService } from '../services/api';
import NewsCard from '../components/NewsCard';

type NewsSource = 'database' | 'bbc' | 'espn' | 'goal';

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

  const scrapeNews = async (source: 'bbc' | 'espn' | 'goal') => {
    setScraping(true);
    setSelectedSource(source);
    try {
      let response;
      switch (source) {
        case 'bbc':
          response = await scraperService.scrapeBBCNews();
          break;
        case 'espn':
          response = await scraperService.scrapeESPNNews();
          break;
        case 'goal':
          response = await scraperService.scrapeGoalNews();
          break;
      }

      // 转换爬虫数据格式为统一格式
      const scrapedNews = response.data.map((item: any, index: number) => ({
        id: `scraped-${source}-${index}`,
        title: item.title,
        summary: item.description || item.summary || '',
        content: item.description || item.summary || '',
        coverImage: item.image || item.imageUrl || null,
        category: source.toUpperCase(),
        author: item.author || source.toUpperCase(),
        publishDate: item.publishDate || item.date || new Date().toISOString(),
        views: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      setNews(scrapedNews);
    } catch (error) {
      console.error(`从${source.toUpperCase()}爬取新闻失败:`, error);
      setNews([]);
    } finally {
      setScraping(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">足球资讯</h1>

        {/* 数据源选择 */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">数据源:</span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setSelectedSource('database');
                loadNews();
              }}
              disabled={loading || scraping}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedSource === 'database'
                  ? 'bg-green-600 text-white'
                  : 'bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700'
              } disabled:opacity-50`}
            >
              数据库
            </button>
            <button
              onClick={() => scrapeNews('bbc')}
              disabled={loading || scraping}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedSource === 'bbc'
                  ? 'bg-green-600 text-white'
                  : 'bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700'
              } disabled:opacity-50`}
            >
              BBC Sport
            </button>
            <button
              onClick={() => scrapeNews('espn')}
              disabled={loading || scraping}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedSource === 'espn'
                  ? 'bg-green-600 text-white'
                  : 'bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700'
              } disabled:opacity-50`}
            >
              ESPN
            </button>
            <button
              onClick={() => scrapeNews('goal')}
              disabled={loading || scraping}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedSource === 'goal'
                  ? 'bg-green-600 text-white'
                  : 'bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700'
              } disabled:opacity-50`}
            >
              Goal.com
            </button>
          </div>
        </div>
      </div>

      {/* Loading状态 */}
      {(loading || scraping) && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item) => (
                <NewsCard key={item.id} news={item} />
              ))}
            </div>
          ) : (
            <div className="card p-12 text-center">
              <p className="text-gray-500 text-lg">暂无新闻</p>
              <p className="text-gray-400 text-sm mt-2">请尝试从其他数据源获取新闻</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NewsPage;
