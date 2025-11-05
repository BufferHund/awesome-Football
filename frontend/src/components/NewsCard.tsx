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
    <Link to={`/news/${news.id}`} className="card overflow-hidden block hover:scale-[1.02] transition-transform">
      {news.coverImage && (
        <div className="aspect-video bg-gray-200 overflow-hidden">
          <img
            src={news.coverImage}
            alt={news.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-2">
          <span className="badge bg-green-100 text-green-800">{news.category}</span>
          {news.author && <span className="text-xs text-gray-500">• {news.author}</span>}
        </div>
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{news.title}</h3>
        {news.summary && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{news.summary}</p>
        )}
        <div className="flex items-center justify-between text-xs text-gray-500">
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
