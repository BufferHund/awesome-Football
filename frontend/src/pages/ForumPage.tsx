import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ForumPost } from '../types';
import { forumService } from '../services/api';
import { MessageCircle, ThumbsUp, Eye, TrendingUp, Clock, Flame, Zap, Users, Target, Trophy } from 'lucide-react';
import CreatePostModal from '../components/CreatePostModal';

type Category = 'all' | '综合讨论' | '战术分析' | '球员评价' | '赛事预测' | '转会爆料';
type SortBy = 'latest' | 'hot' | 'views';

const ForumPage = () => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [sortBy, setSortBy] = useState<SortBy>('latest');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const categories: { value: Category; label: string; icon: JSX.Element; gradient: string }[] = [
    {
      value: 'all',
      label: '全部动态',
      icon: <Trophy className="w-5 h-5" />,
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      value: '综合讨论',
      label: '足坛热点',
      icon: <Flame className="w-5 h-5" />,
      gradient: 'from-red-500 to-pink-500'
    },
    {
      value: '战术分析',
      label: '战术板',
      icon: <Target className="w-5 h-5" />,
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      value: '球员评价',
      label: '球星点评',
      icon: <Users className="w-5 h-5" />,
      gradient: 'from-purple-500 to-indigo-500'
    },
    {
      value: '赛事预测',
      label: '赛事前瞻',
      icon: <Zap className="w-5 h-5" />,
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      value: '转会爆料',
      label: '转会风云',
      icon: <TrendingUp className="w-5 h-5" />,
      gradient: 'from-orange-500 to-red-500'
    },
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
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-primary-600 border-r-transparent border-b-primary-600 border-l-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 font-medium">加载精彩内容中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 顶部英雄区 - 体育风格 */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl">
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNm0wLTJjLTQuNDE4IDAtOCAzLjU4Mi04IDhzMy41ODIgOCA4IDggOC0zLjU4MiA4LTgtMy41ODItOC04LTh6IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-white/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-black/20 to-transparent rounded-full blur-3xl"></div>

        <div className="relative z-10 px-6 md:px-10 py-8 md:py-12">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <MessageCircle className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-5xl font-black text-white drop-shadow-2xl tracking-tight">
                    懂球圈
                  </h1>
                  <p className="text-white/90 text-base md:text-lg font-medium mt-1">
                    全球球迷聚集地 · 热议每一场比赛
                  </p>
                </div>
              </div>

              {/* 统计数据 */}
              <div className="flex items-center gap-6 mt-4 text-white/90">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span className="text-sm font-semibold">23.5万+球迷</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-semibold">日均8000+讨论</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="group flex items-center gap-3 px-8 py-4 bg-white hover:bg-gray-50 text-green-600 font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-left hidden md:block">
                <div className="text-lg leading-none">发表观点</div>
                <div className="text-xs text-gray-500 mt-1">分享你的足球见解</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* 分类导航 - 专业体育风格 */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`
                group relative flex items-center gap-2.5 px-5 py-3.5 rounded-2xl whitespace-nowrap
                font-bold text-sm transition-all duration-300 flex-shrink-0
                ${selectedCategory === cat.value
                  ? `bg-gradient-to-r ${cat.gradient} text-white shadow-lg shadow-${cat.gradient}/50 scale-105`
                  : 'bg-gray-100 dark:bg-dark-200 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-100 hover:scale-105'
                }
              `}
            >
              <div className={`${selectedCategory === cat.value ? 'animate-pulse' : ''}`}>
                {cat.icon}
              </div>
              <span>{cat.label}</span>
              {selectedCategory === cat.value && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 排序和筛选栏 */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSortBy('latest')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                sortBy === 'latest'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-200'
              }`}
            >
              <Clock className="w-4 h-4" />
              最新
            </button>
            <button
              onClick={() => setSortBy('hot')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                sortBy === 'hot'
                  ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-200'
              }`}
            >
              <Flame className="w-4 h-4" />
              最热
            </button>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            共 <span className="text-primary-600 dark:text-primary-400 font-bold">{posts.length}</span> 条动态
          </div>
        </div>
      </div>

      {/* 帖子列表 - 体育卡片风格 */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="glass-card p-16 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-dark-200 dark:to-dark-300 rounded-3xl flex items-center justify-center">
              <MessageCircle className="w-12 h-12 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-xl font-bold mb-3">暂无动态</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mb-6">快来发表你的足球观点吧！</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:shadow-xl transition-all"
            >
              立即发声
            </button>
          </div>
        ) : (
          posts.map((post) => (
            <Link
              key={post.id}
              to={`/forum/${post.id}`}
              className="block group"
            >
              <div className="glass-card p-5 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-l-4 border-transparent hover:border-primary-500">
                <div className="flex items-start gap-4">
                  {/* 作者头像 - 更专业的展示 */}
                  <div className="flex-shrink-0 relative">
                    {post.authorAvatar ? (
                      <img
                        src={post.authorAvatar}
                        alt={post.author}
                        className="w-14 h-14 rounded-2xl border-2 border-gray-200 dark:border-gray-700 object-cover"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-black text-xl shadow-lg">
                        {post.author.charAt(0)}
                      </div>
                    )}
                    {/* 在线状态指示器 */}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-white dark:border-dark-100 rounded-full"></div>
                  </div>

                  {/* 帖子内容 */}
                  <div className="flex-1 min-w-0">
                    {/* 标题行 */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {post.isPinned && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-red-600 to-pink-600 text-white text-xs font-bold rounded-lg shadow-md">
                          <Trophy className="w-3 h-3" />
                          置顶
                        </span>
                      )}
                      {post.isHot && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-orange-600 to-red-600 text-white text-xs font-bold rounded-lg shadow-md animate-pulse">
                          <Flame className="w-3 h-3" />
                          热门
                        </span>
                      )}
                      <h3 className="text-lg md:text-xl font-black text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {post.title}
                      </h3>
                    </div>

                    {/* 作者和时间 */}
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm font-bold text-primary-600 dark:text-primary-400">{post.author}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">{formatTime(post.createdAt)}</span>
                      <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-md">
                        {post.category}
                      </span>
                    </div>

                    {/* 内容预览 */}
                    <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base line-clamp-2 mb-4 leading-relaxed">
                      {post.content}
                    </p>

                    {/* 标签 */}
                    {post.tags.length > 0 && (
                      <div className="flex items-center gap-2 mb-4 flex-wrap">
                        {post.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold border border-blue-200 dark:border-blue-800"
                          >
                            #{tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="text-xs text-gray-400">+{post.tags.length - 3}</span>
                        )}
                      </div>
                    )}

                    {/* 图片预览 - 更紧凑的展示 */}
                    {post.images.length > 0 && (
                      <div className="flex gap-2 mb-4">
                        {post.images.slice(0, 3).map((img, index) => (
                          <div key={index} className="relative group/img">
                            <img
                              src={img}
                              alt={`图片${index + 1}`}
                              className="w-24 h-24 object-cover rounded-xl border-2 border-gray-200 dark:border-gray-700 group-hover/img:scale-110 transition-transform"
                            />
                            {index === 2 && post.images.length > 3 && (
                              <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-lg">+{post.images.length - 3}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 互动数据 - 体育风格的数据展示 */}
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer group/stat">
                        <div className="w-8 h-8 bg-gray-100 dark:bg-dark-200 rounded-lg flex items-center justify-center group-hover/stat:bg-blue-100 dark:group-hover/stat:bg-blue-900/30 transition-colors">
                          <Eye className="w-4 h-4" />
                        </div>
                        <span className="font-bold">{formatNumber(post.views)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer group/stat">
                        <div className="w-8 h-8 bg-gray-100 dark:bg-dark-200 rounded-lg flex items-center justify-center group-hover/stat:bg-red-100 dark:group-hover/stat:bg-red-900/30 transition-colors">
                          <ThumbsUp className="w-4 h-4" />
                        </div>
                        <span className="font-bold">{formatNumber(post.likes)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors cursor-pointer group/stat">
                        <div className="w-8 h-8 bg-gray-100 dark:bg-dark-200 rounded-lg flex items-center justify-center group-hover/stat:bg-green-100 dark:group-hover/stat:bg-green-900/30 transition-colors">
                          <MessageCircle className="w-4 h-4" />
                        </div>
                        <span className="font-bold">{formatNumber(post.commentsCount)}</span>
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
