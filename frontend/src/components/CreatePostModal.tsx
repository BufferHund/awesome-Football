import { useState } from 'react';
import { X, ImageIcon, Tag, Flame, Target, Users, Zap, TrendingUp, Sparkles } from 'lucide-react';

type Category = '综合讨论' | '战术分析' | '球员评价' | '赛事预测' | '转会爆料';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    content: string;
    category: Category;
    tags: string[];
    images: string[];
  }) => Promise<void>;
}

const CreatePostModal = ({ isOpen, onClose, onSubmit }: CreatePostModalProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Category>('综合讨论');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const categories: { value: Category; label: string; icon: JSX.Element; gradient: string }[] = [
    {
      value: '综合讨论',
      label: '足坛热点',
      icon: <Flame className="w-4 h-4" />,
      gradient: 'from-red-500 to-pink-500'
    },
    {
      value: '战术分析',
      label: '战术板',
      icon: <Target className="w-4 h-4" />,
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      value: '球员评价',
      label: '球星点评',
      icon: <Users className="w-4 h-4" />,
      gradient: 'from-purple-500 to-indigo-500'
    },
    {
      value: '赛事预测',
      label: '赛事前瞻',
      icon: <Zap className="w-4 h-4" />,
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      value: '转会爆料',
      label: '转会风云',
      icon: <TrendingUp className="w-4 h-4" />,
      gradient: 'from-orange-500 to-red-500'
    },
  ];

  const handleAddTag = () => {
    if (tagInput.trim() && tags.length < 5 && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleAddImage = () => {
    if (imageUrl.trim() && images.length < 9 && !images.includes(imageUrl.trim())) {
      setImages([...images, imageUrl.trim()]);
      setImageUrl('');
    }
  };

  const handleRemoveImage = (imageToRemove: string) => {
    setImages(images.filter(img => img !== imageToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert('标题和内容不能为空');
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit({
        title: title.trim(),
        content: content.trim(),
        category,
        tags,
        images,
      });

      // 重置表单
      setTitle('');
      setContent('');
      setCategory('综合讨论');
      setTags([]);
      setImages([]);
      setTagInput('');
      setImageUrl('');

      onClose();
    } catch (error) {
      console.error('发布失败:', error);
      alert('发布失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-dark-100 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-scale-up">
        {/* 头部 - 体育风格 */}
        <div className="relative bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-6">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNm0wLTJjLTQuNDE4IDAtOCAzLjU4Mi04IDhzMy41ODIgOCA4IDggOC0zLjU4MiA4LTgtMy41ODItOC04LTh6IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">发表观点</h2>
                <p className="text-white/80 text-sm">分享你的足球见解</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* 表单内容 */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-160px)]">
          <div className="p-6 space-y-6">
            {/* 分类选择 - 体育风格 */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                选择话题 *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value)}
                    className={`
                      relative flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl text-sm font-bold
                      transition-all duration-300
                      ${category === cat.value
                        ? `bg-gradient-to-r ${cat.gradient} text-white shadow-xl scale-105`
                        : 'bg-gray-100 dark:bg-dark-200 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-100 hover:scale-105'
                      }
                    `}
                  >
                    {cat.icon}
                    <span>{cat.label}</span>
                    {category === cat.value && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 标题输入 */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                标题 *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="输入一个吸引眼球的标题..."
                className="w-full px-5 py-4 bg-gray-50 dark:bg-dark-300 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-gray-100 font-medium placeholder:text-gray-400 transition-all"
                maxLength={100}
                required
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-400">好标题能吸引更多关注</p>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{title.length}/100</p>
              </div>
            </div>

            {/* 内容输入 */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                内容 *
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="详细描述你的观点和分析..."
                className="w-full px-5 py-4 bg-gray-50 dark:bg-dark-300 border-2 border-gray-200 dark:border-gray-700 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-gray-100 font-medium placeholder:text-gray-400 leading-relaxed transition-all"
                rows={8}
                maxLength={5000}
                required
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-400">支持详细的论述和案例分析</p>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{content.length}/5000</p>
              </div>
            </div>

            {/* 标签输入 */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                添加标签 <span className="text-gray-400 font-normal">(最多5个)</span>
              </label>
              <div className="flex gap-2 mb-3">
                <div className="relative flex-1">
                  <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="输入标签，按Enter添加"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-dark-300 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-gray-100 font-medium placeholder:text-gray-400"
                    maxLength={20}
                    disabled={tags.length >= 5}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddTag}
                  disabled={tags.length >= 5 || !tagInput.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  添加
                </button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 text-blue-600 dark:text-blue-400 rounded-xl text-sm font-bold border-2 border-blue-200 dark:border-blue-800"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 图片输入 */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                添加图片 <span className="text-gray-400 font-normal">(最多9张)</span>
              </label>
              <div className="flex gap-2 mb-3">
                <div className="relative flex-1">
                  <ImageIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddImage();
                      }
                    }}
                    placeholder="输入图片URL，按Enter添加"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-dark-300 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-gray-100 font-medium placeholder:text-gray-400"
                    disabled={images.length >= 9}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddImage}
                  disabled={images.length >= 9 || !imageUrl.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  添加
                </button>
              </div>
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img}
                        alt={`图片${index + 1}`}
                        className="w-full h-28 object-cover rounded-xl border-2 border-gray-200 dark:border-gray-700"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200?text=Invalid+URL';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(img)}
                        className="absolute -top-2 -right-2 w-7 h-7 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-700 shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 底部按钮 */}
          <div className="flex items-center justify-between gap-3 p-6 border-t-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-200">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              发布后将公开显示，请遵守社区规范
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-3 bg-gray-200 dark:bg-dark-300 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-dark-100 font-bold transition-all"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={submitting || !title.trim() || !content.trim()}
                className="relative px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed font-bold transition-all hover:scale-105 active:scale-95 disabled:hover:scale-100"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    发布中...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    立即发布
                  </span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
