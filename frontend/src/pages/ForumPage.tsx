import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ForumPost } from '../types';
import { forumService } from '../services/api';
import { MessageCircle, ThumbsUp, Eye, TrendingUp, Clock, Flame, Zap, Users, Target, Trophy } from 'lucide-react';
import CreatePostModal from '../components/CreatePostModal';
import { useAuth } from '../contexts/AuthContext';

type Category = 'all' | '综合讨论' | '战术分析' | '球员评价' | '赛事预测' | '转会爆料';
type SortBy = 'latest' | 'hot' | 'views';

const ForumPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [sortBy, setSortBy] = useState<SortBy>('latest');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const categories: { value: Category; label: string }[] = [
    { value: 'all', label: '全部动态' },
    { value: '综合讨论', label: '足坛热点' },
    { value: '战术分析', label: '战术板' },
    { value: '球员评价', label: '球星点评' },
    { value: '赛事预测', label: '赛事前瞻' },
    { value: '转会爆料', label: '转会风云' },
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

  const handlePostButtonClick = () => {
    // 检查是否已登录
    if (!isAuthenticated) {
      alert('请先登录才能发帖');
      navigate('/login');
      return;
    }

    // 检查邮箱是否已验证
    if (!user?.emailVerified) {
      alert('请先验证邮箱才能发帖。您可以在个人中心验证邮箱。');
      navigate('/profile');
      return;
    }

    setShowCreateModal(true);
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
        author: user?.username || '球迷用户',
      });
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

  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + 'w';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-gray-900 dark:border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 页面标题 */}
      <div className="flex items-center justify-between py-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
          懂球圈
        </h1>
        <button
          onClick={handlePostButtonClick}
          className="px-4 py-2 text-sm font-medium bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors rounded-lg"
        >
          发表观点
        </button>
      </div>

      {/* 分类和排序 - 合并为一个区域 */}
      <div className="space-y-3">
        {/* 分类导航 */}
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`
                px-4 py-2 text-sm font-medium transition-colors rounded-lg
                ${selectedCategory === cat.value
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-black'
                  : 'border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:border-gray-900 dark:hover:border-white'
                }
              `}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 排序栏 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSortBy('latest')}
              className={`text-sm font-medium transition-colors ${
                sortBy === 'latest'
                  ? 'text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              最新
            </button>
            <button
              onClick={() => setSortBy('hot')}
              className={`text-sm font-medium transition-colors ${
                sortBy === 'hot'
                  ? 'text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              最热
            </button>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            {posts.length} 条动态
          </div>
        </div>
      </div>

      {/* 帖子列表 */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="py-20 text-center border border-gray-200 dark:border-gray-800 rounded-2xl">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-2">暂无动态</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">快来发表你的足球观点吧</p>
            <button
              onClick={handlePostButtonClick}
              className="px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-black text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors rounded-lg"
            >
              发表观点
            </button>
          </div>
        ) : (
          posts.map((post) => (
            <Link
              key={post.id}
              to={`/forum/${post.id}`}
              className="block group"
            >
              <div className="border border-gray-200 dark:border-gray-800 p-5 hover:border-gray-900 dark:hover:border-white transition-colors rounded-2xl">
                <div className="flex items-start gap-4">
                  {/* 作者头像 */}
                  <div className="flex-shrink-0">
                    {post.authorAvatar ? (
                      <img
                        src={post.authorAvatar}
                        alt={post.author}
                        className="w-12 h-12 bg-gray-100 dark:bg-gray-900 object-cover rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-900 dark:bg-white flex items-center justify-center text-white dark:text-black text-sm font-bold rounded-full">
                        {post.author.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* 帖子内容 */}
                  <div className="flex-1 min-w-0">
                    {/* 作者和时间 */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap text-sm">
                      <span className="font-medium text-gray-900 dark:text-white">{post.author}</span>
                      <span className="text-gray-400 dark:text-gray-500">·</span>
                      <span className="text-gray-500 dark:text-gray-400">{formatTime(post.createdAt)}</span>
                      {post.isPinned && (
                        <>
                          <span className="text-gray-400 dark:text-gray-500">·</span>
                          <span className="text-gray-900 dark:text-white">置顶</span>
                        </>
                      )}
                      {post.isHot && (
                        <>
                          <span className="text-gray-400 dark:text-gray-500">·</span>
                          <span className="text-gray-900 dark:text-white">热门</span>
                        </>
                      )}
                    </div>

                    {/* 标题 */}
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {post.title}
                    </h3>

                    {/* 内容预览 */}
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
                      {post.content}
                    </p>

                    {/* 标签和分类 */}
                    {(post.tags.length > 0 || post.category) && (
                      <div className="flex items-center gap-2 mb-3 flex-wrap text-xs text-gray-500 dark:text-gray-400">
                        {post.category && <span>{post.category}</span>}
                        {post.tags.length > 0 && post.category && <span>·</span>}
                        {post.tags.slice(0, 3).map((tag, index) => (
                          <span key={index}>
                            #{tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span>+{post.tags.length - 3}</span>
                        )}
                      </div>
                    )}

                    {/* 图片预览 */}
                    {post.images.length > 0 && (
                      <div className="flex gap-2 mb-3">
                        {post.images.slice(0, 3).map((img, index) => (
                          <div key={index} className="relative">
                            <img
                              src={img}
                              alt={`图片${index + 1}`}
                              className="w-20 h-20 object-cover bg-gray-100 dark:bg-gray-900 rounded-lg"
                            />
                            {index === 2 && post.images.length > 3 && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm font-medium rounded-lg">
                                +{post.images.length - 3}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 互动数据 */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{formatNumber(post.views)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{formatNumber(post.likes)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{formatNumber(post.commentsCount)}</span>
                      </div>
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
