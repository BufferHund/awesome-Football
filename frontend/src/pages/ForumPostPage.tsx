import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ForumPost, ForumComment } from '../types';
import { forumService } from '../services/api';
import {
  ThumbsUp,
  MessageCircle,
  Eye,
  ArrowLeft,
  Hash,
  Send,
  Reply
} from 'lucide-react';

const ForumPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<ForumPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState('');
  const [replyTo, setReplyTo] = useState<{ id: number; author: string } | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likedComments, setLikedComments] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (id) {
      loadPost();
    }
  }, [id]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const response = await forumService.getPostById(parseInt(id!));
      setPost(response.data);
    } catch (error) {
      console.error('加载帖子失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLikePost = async () => {
    if (!post || isLiked) return;

    try {
      await forumService.likePost(post.id);
      setPost({ ...post, likes: post.likes + 1 });
      setIsLiked(true);
    } catch (error) {
      console.error('点赞失败:', error);
    }
  };

  const handleLikeComment = async (commentId: number) => {
    if (likedComments.has(commentId)) return;

    try {
      await forumService.likeComment(commentId);
      setLikedComments(new Set([...likedComments, commentId]));

      // 更新评论点赞数
      if (post) {
        const updatedComments = post.comments?.map(comment => {
          if (comment.id === commentId) {
            return { ...comment, likes: comment.likes + 1 };
          }
          // 检查回复
          if (comment.replies) {
            const updatedReplies = comment.replies.map(reply => {
              if (reply.id === commentId) {
                return { ...reply, likes: reply.likes + 1 };
              }
              return reply;
            });
            return { ...comment, replies: updatedReplies };
          }
          return comment;
        });
        setPost({ ...post, comments: updatedComments });
      }
    } catch (error) {
      console.error('点赞评论失败:', error);
    }
  };

  const handleSubmitComment = async () => {
    if (!commentContent.trim() || !post) return;

    try {
      await forumService.createComment(post.id, {
        content: commentContent,
        parentId: replyTo?.id,
        author: '球迷用户',
      });

      // 重新加载帖子以获取新评论
      await loadPost();
      setCommentContent('');
      setReplyTo(null);
    } catch (error) {
      console.error('发表评论失败:', error);
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
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'numeric', day: 'numeric' });
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

  if (!post) {
    return (
      <div className="glass-card p-12 text-center">
        <p className="text-gray-500 dark:text-gray-400 text-lg">帖子不存在</p>
        <button
          onClick={() => navigate('/forum')}
          className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          返回论坛
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 返回按钮 */}
      <button
        onClick={() => navigate('/forum')}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>返回论坛</span>
      </button>

      {/* 帖子内容卡片 */}
      <div className="glass-card p-6 md:p-8">
        {/* 作者信息 */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
          {post.authorAvatar ? (
            <img
              src={post.authorAvatar}
              alt={post.author}
              className="w-16 h-16 rounded-full border-2 border-gray-200 dark:border-gray-700"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-2xl">
              {post.author.charAt(0)}
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{post.author}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{formatTime(post.createdAt)}</p>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{post.views}</span>
            </div>
          </div>
        </div>

        {/* 帖子标题 */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {post.title}
        </h1>

        {/* 标签 */}
        {post.tags.length > 0 && (
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium"
              >
                <Hash className="w-4 h-4" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 帖子内容 */}
        <div className="prose dark:prose-invert max-w-none mb-6">
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
            {post.content}
          </p>
        </div>

        {/* 图片 */}
        {post.images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {post.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`图片${index + 1}`}
                className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
              />
            ))}
          </div>
        )}

        {/* 互动按钮 */}
        <div className="flex items-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLikePost}
            disabled={isLiked}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              isLiked
                ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                : 'bg-gray-100 dark:bg-dark-200 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-400'
            }`}
          >
            <ThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span>{post.likes}</span>
          </button>
          <div className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-dark-200 text-gray-700 dark:text-gray-300 rounded-xl font-medium">
            <MessageCircle className="w-5 h-5" />
            <span>{post.commentsCount} 评论</span>
          </div>
        </div>
      </div>

      {/* 评论输入框 */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {replyTo ? `回复 @${replyTo.author}` : '发表评论'}
        </h3>
        {replyTo && (
          <button
            onClick={() => setReplyTo(null)}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-2"
          >
            取消回复
          </button>
        )}
        <div className="flex gap-3">
          <textarea
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder={replyTo ? `回复 @${replyTo.author}...` : '说说你的看法...'}
            className="flex-1 px-4 py-3 bg-gray-50 dark:bg-dark-300 border border-gray-200 dark:border-gray-700 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-gray-100"
            rows={3}
          />
          <button
            onClick={handleSubmitComment}
            disabled={!commentContent.trim()}
            className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all self-end"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 评论列表 */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
          全部评论 ({post.comments?.length || 0})
        </h3>

        {post.comments && post.comments.length > 0 ? (
          <div className="space-y-6">
            {post.comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
                {/* 评论内容 */}
                <div className="flex items-start gap-4">
                  {comment.authorAvatar ? (
                    <img
                      src={comment.authorAvatar}
                      alt={comment.author}
                      className="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-700"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-teal-600 flex items-center justify-center text-white font-bold">
                      {comment.author.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900 dark:text-gray-100">{comment.author}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTime(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">{comment.content}</p>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLikeComment(comment.id)}
                        disabled={likedComments.has(comment.id)}
                        className={`flex items-center gap-1 text-sm transition-colors ${
                          likedComments.has(comment.id)
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'
                        }`}
                      >
                        <ThumbsUp className={`w-4 h-4 ${likedComments.has(comment.id) ? 'fill-current' : ''}`} />
                        <span>{comment.likes}</span>
                      </button>
                      <button
                        onClick={() => setReplyTo({ id: comment.id, author: comment.author })}
                        className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        <Reply className="w-4 h-4" />
                        <span>回复</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 回复列表 */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-14 mt-4 space-y-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex items-start gap-3">
                        {reply.authorAvatar ? (
                          <img
                            src={reply.authorAvatar}
                            alt={reply.author}
                            className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-700"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                            {reply.author.charAt(0)}
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm text-gray-900 dark:text-gray-100">{reply.author}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatTime(reply.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{reply.content}</p>
                          <button
                            onClick={() => handleLikeComment(reply.id)}
                            disabled={likedComments.has(reply.id)}
                            className={`flex items-center gap-1 text-xs transition-colors ${
                              likedComments.has(reply.id)
                                ? 'text-red-600 dark:text-red-400'
                                : 'text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'
                            }`}
                          >
                            <ThumbsUp className={`w-3 h-3 ${likedComments.has(reply.id) ? 'fill-current' : ''}`} />
                            <span>{reply.likes}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p className="text-gray-500 dark:text-gray-400">还没有评论，快来抢沙发吧！</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForumPostPage;
