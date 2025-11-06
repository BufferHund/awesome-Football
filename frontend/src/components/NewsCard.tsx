import { Link } from 'react-router-dom';
import { News } from '../types';
import { Eye, Calendar, ExternalLink } from 'lucide-react';

interface NewsCardProps {
  news: News;
}

const NewsCard = ({ news }: NewsCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // 判断是否为外部新闻（爬虫新闻）
  const isExternalNews = !!news.externalUrl;
  const isScrapedNews = typeof news.id === 'string' && news.id.startsWith('scraped-');

  // 如果是爬虫新闻但没有外部链接，或者没有有效ID，则不可点击
  const isClickable = isExternalNews || (typeof news.id === 'number');

  // 渲染可点击的卡片
  if (isExternalNews) {
    return (
      <a
        href={news.externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden block hover:border-gray-900 dark:hover:border-white transition-colors group"
      >
        <NewsCardContent news={news} isExternalNews={true} formatDate={formatDate} />
      </a>
    );
  }

  // 渲染内部链接卡片
  if (isClickable && typeof news.id === 'number') {
    return (
      <Link to={`/news/${news.id}`} className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden block hover:border-gray-900 dark:hover:border-white transition-colors group">
        <NewsCardContent news={news} isExternalNews={false} formatDate={formatDate} />
      </Link>
    );
  }

  // 不可点击的卡片（爬虫新闻但没有URL）
  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden block opacity-75 cursor-not-allowed">
      <NewsCardContent news={news} isExternalNews={false} formatDate={formatDate} />
    </div>
  );
};

// 提取卡片内容组件以避免重复
const NewsCardContent = ({
  news,
  isExternalNews,
  formatDate
}: {
  news: News;
  isExternalNews: boolean;
  formatDate: (dateString: string) => string;
}) => (
  <>
      {news.coverImage && (
        <div className="aspect-video bg-gray-200 dark:bg-zinc-700 overflow-hidden">
          <img
            src={news.coverImage}
            alt={news.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-2">
          <span className="badge bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 rounded-full">{news.category}</span>
          {news.author && <span className="text-xs text-gray-500 dark:text-gray-400">• {news.author}</span>}
          {isExternalNews && (
            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              • <ExternalLink className="w-3 h-3" />
            </span>
          )}
        </div>
        <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{news.title}</h3>
        {news.summary && (
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">{news.summary}</p>
        )}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(news.publishDate)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Eye className="w-3 h-3" />
            <span>{news.views} 浏览</span>
          </div>
        </div>
      </div>
  </>
);

export default NewsCard;
