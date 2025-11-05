import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { News } from '../types';
import { newsService } from '../services/api';
import { Calendar, User, Eye } from 'lucide-react';

const NewsDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadNews(parseInt(id));
    }
  }, [id]);

  const loadNews = async (newsId: number) => {
    try {
      const response = await newsService.getById(newsId);
      setNews(response.data);
    } catch (error) {
      console.error('加载新闻详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="card p-12 text-center">
        <p className="text-gray-500 text-lg">新闻不存在</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <article className="card overflow-hidden">
        {/* 封面图 */}
        {news.coverImage && (
          <div className="aspect-video bg-gray-200">
            <img
              src={news.coverImage}
              alt={news.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-8">
          {/* 分类标签 */}
          <div className="mb-4">
            <span className="badge bg-green-100 text-green-800 text-sm">
              {news.category}
            </span>
          </div>

          {/* 标题 */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{news.title}</h1>

          {/* 摘要 */}
          {news.summary && (
            <p className="text-xl text-gray-600 mb-6 border-l-4 border-green-600 pl-4">
              {news.summary}
            </p>
          )}

          {/* 元信息 */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b">
            {news.author && (
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>{news.author}</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(news.publishDate)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{news.views} 浏览</span>
            </div>
          </div>

          {/* 正文 */}
          <div className="prose prose-lg max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {news.content}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default NewsDetailPage;
