import { Link } from 'react-router-dom';
import { News } from '../types';
import { Eye, Calendar } from 'lucide-react';

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

  return (
    <Link to={`/news/${news.id}`} className="glass-card overflow-hidden block hover-lift group">
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
          <span className="badge bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300">{news.category}</span>
          {news.author && <span className="text-xs text-gray-500 dark:text-gray-400">• {news.author}</span>}
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
    </Link>
  );
};

export default NewsCard;
