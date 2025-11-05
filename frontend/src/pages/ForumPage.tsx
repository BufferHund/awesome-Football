import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ForumPost } from '../types';
import { forumService } from '../services/api';
import { MessageCircle, ThumbsUp, Eye, TrendingUp, Clock, Pin, PenSquare, Hash } from 'lucide-react';
import CreatePostModal from '../components/CreatePostModal';

type Category = 'all' | '综合讨论' | '战术分析' | '球员评价' | '赛事预测' | '转会爆料';
type SortBy = 'latest' | 'hot' | 'views';

const ForumPage = () => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [sortBy, setSortBy] = useState<SortBy>('latest');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const categories: { value: Category; label: string; icon: string }[] = [
    { value: 'all', label: '全部', icon: '🏆' },
    { value: '综合讨论', label: '综合讨论', icon: '💬' },
    { value: '战术分析', label: '战术分析', icon: '⚽' },
    { value: '球员评价', label: '球员评价', icon: '👤' },
    { value: '赛事预测', label: '赛事预测', icon: '🔮' },
    { value: '转会爆料', label: '转会爆料', icon: '📰' },
  ];

  useEffect(() => {
    loadPosts();
  }, [selectedCategory, sortBy]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await forumService.getPosts({
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        sortBy,
        limit: 20,
      });
      setPosts(response.data.data);
    } catch (error) {
      console.error('加载帖子失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (data: {
    title: string;
    content: string;
    category: string;
    tags: string[];
    images: string[];
  }) => {
    try {
      await forumService.createPost({
        ...data,
        author: '球迷用户',
      });
      // 重新加载帖子列表
      await loadPosts();
      setShowCreateModal(false);
    } catch (error) {
      console.error('创建帖子失败:', error);
      throw error;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 7) return `${diffDays}天前`;
    return date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 顶部横幅 */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg">球迷论坛</h1>
            <p className="text-white/90 text-lg">分享观点，畅聊足球</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-white text-green-600 font-semibold rounded-xl hover:bg-green-50 hover:scale-105 transition-all duration-300 shadow-lg"
          >
            <PenSquare className="w-5 h-5" />
            <span className="hidden md:inline">发帖</span>
          </button>
        </div>
      </div>

      {/* 分类导航 */}
      <div className="glass-card p-2">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap
                font-medium transition-all duration-300
                ${selectedCategory === cat.value
                  ? 'bg-primary-500 text-white shadow-lg scale-105'
                  : 'bg-gray-100 dark:bg-dark-200 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-100'
                }
              `}
            >
              <span className="text-lg">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 排序选项 */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSortBy('latest')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            sortBy === 'latest'
              ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          最新
        </button>
        <button
          onClick={() => setSortBy('hot')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            sortBy === 'hot'
              ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          最热
        </button>
      </div>

      {/* 帖子列表 */}
      <div className="space-y-3">
        {posts.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <div className="text-gray-400 mb-4">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-2">暂无帖子</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">快来发布第一个帖子吧！</p>
          </div>
        ) : (
          posts.map((post) => (
            <Link
              key={post.id}
              to={`/forum/${post.id}`}
              className="block glass-card p-4 hover:shadow-xl hover:scale-[1.01] transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                {/* 作者头像 */}
                <div className="flex-shrink-0">
                  {post.authorAvatar ? (
                    <img
                      src={post.authorAvatar}
                      alt={post.author}
                      className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-gray-700"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg">
                      {post.author.charAt(0)}
                    </div>
                  )}
                </div>

                {/* 帖子内容 */}
                <div className="flex-1 min-w-0">
                  {/* 标题和标签 */}
                  <div className="flex items-start gap-2 mb-2">
                    {post.isPinned && (
                      <Pin className="w-4 h-4 text-red-500 dark:text-red-400 flex-shrink-0 mt-1" />
                    )}
                    {post.isHot && (
                      <span className="badge badge-live text-xs flex-shrink-0 mt-1">热</span>
                    )}
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 flex-1">
                      {post.title}
                    </h3>
                  </div>

                  {/* 内容预览 */}
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
                    {post.content}
                  </p>

                  {/* 标签 */}
                  {post.tags.length > 0 && (
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-medium"
                        >
                          <Hash className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 图片预览 */}
                  {post.images.length > 0 && (
                    <div className="flex gap-2 mb-3">
                      {post.images.slice(0, 3).map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt={`图片${index + 1}`}
                          className="w-20 h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                        />
                      ))}
                      {post.images.length > 3 && (
                        <div className="w-20 h-20 bg-gray-100 dark:bg-dark-200 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm font-medium">
                          +{post.images.length - 3}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 底部信息 */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium text-primary-600 dark:text-primary-400">{post.author}</span>
                    <span className="text-xs">{formatTime(post.createdAt)}</span>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{post.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.commentsCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* 创建帖子模态框 */}
      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreatePost}
      />
    </div>
  );
};

export default ForumPage;
