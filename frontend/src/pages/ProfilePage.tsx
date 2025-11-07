import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { authServiceClient } from '../services/authService';
import {
  User as UserIcon,
  Mail,
  Crown,
  CheckCircle,
  XCircle,
  LogOut,
  Trash2,
  AlertCircle,
  Copy,
  ExternalLink,
  Settings,
} from 'lucide-react';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, refreshUser } = useAuth();
  const { showToast, showConfirm } = useToast();
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [verificationToken, setVerificationToken] = useState('');
  const [showVerificationInfo, setShowVerificationInfo] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleResendVerification = async () => {
    if (!user?.email) return;

    setLoading(true);
    try {
      const token = await authServiceClient.resendVerification(user.email);
      setVerificationToken(token);
      setShowVerificationInfo(true);
    } catch (error: any) {
      showToast(error.message || '发送验证邮件失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyVerificationLink = () => {
    const verificationUrl = `${window.location.origin}/api/auth/verify-email/${verificationToken}`;
    navigator.clipboard.writeText(verificationUrl);
    showToast('验证链接已复制到剪贴板', 'success');
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      navigate('/');
    } catch (error: any) {
      showToast(error.message || '注销失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeleteError('');

    if (!deletePassword) {
      setDeleteError('请输入密码以确认删除');
      return;
    }

    const confirmed = await showConfirm('确定要删除账户吗？此操作不可撤销！');
    if (!confirmed) {
      return;
    }

    setLoading(true);
    try {
      await authServiceClient.deleteAccount(deletePassword);
      showToast('账户已成功删除', 'success');
      navigate('/');
    } catch (error: any) {
      setDeleteError(error.message || '删除账户失败');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-gray-300 dark:border-gray-700 border-t-gray-900 dark:border-t-white rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">加载中...</p>
        </div>
      </div>
    );
  }

  const membershipTierMap: Record<string, string> = {
    free: '免费用户',
    trial: '试用会员',
    premium: '高级会员',
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            个人中心
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            管理您的账户信息和设置
          </p>
        </div>

        {/* 用户信息卡片 */}
        <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-6 mb-6 rounded-2xl">
          <div className="flex items-start gap-4">
            {/* 用户头像 */}
            <div className="flex-shrink-0">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-20 h-20 rounded-2xl object-cover"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-900 dark:bg-white flex items-center justify-center rounded-2xl">
                  <UserIcon className="w-10 h-10 text-white dark:text-black" />
                </div>
              )}
            </div>

            {/* 用户信息 */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {user.username}
              </h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Crown className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {membershipTierMap[user.membershipTier] || user.membershipTier}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  {user.emailVerified ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-green-600 dark:text-green-400">邮箱已验证</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-orange-500" />
                      <span className="text-orange-600 dark:text-orange-400">邮箱未验证</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 邮箱验证提示 */}
        {!user.emailVerified && (
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 p-4 mb-6 rounded-2xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-orange-900 dark:text-orange-200 mb-2">
                  请验证您的邮箱
                </h3>
                <p className="text-sm text-orange-700 dark:text-orange-300 mb-3">
                  验证邮箱后，您将可以享受完整的服务功能
                </p>
                <button
                  onClick={handleResendVerification}
                  disabled={loading}
                  className="px-4 py-2 bg-orange-600 dark:bg-orange-500 text-white text-sm font-medium hover:bg-orange-700 dark:hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-full"
                >
                  {loading ? '发送中...' : '发送验证邮件'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 验证链接信息 */}
        {showVerificationInfo && verificationToken && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 mb-6 rounded-2xl">
            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
              验证邮件已发送
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
              由于开发环境限制，请手动访问以下链接完成验证：
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleCopyVerificationLink}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white text-sm font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors rounded-full"
              >
                <Copy className="w-4 h-4" />
                复制验证链接
              </button>
              <a
                href={`${window.location.origin}/api/auth/verify-email/${verificationToken}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 border border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors rounded-full"
              >
                <ExternalLink className="w-4 h-4" />
                打开链接
              </a>
            </div>
          </div>
        )}

        {/* 快捷操作 */}
        <div className="space-y-3 mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
            快捷操作
          </h3>

          {/* 会员升级 */}
          {user.membershipTier === 'free' && (
            <Link
              to="/membership"
              className="block p-4 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 hover:border-gray-900 dark:hover:border-white transition-colors rounded-2xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-900 flex items-center justify-center rounded-xl">
                    <Crown className="w-5 h-5 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      升级会员
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      解锁所有高级功能
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-5 h-5 text-gray-400" />
              </div>
            </Link>
          )}

          {/* 调试面板 */}
          <Link
            to="/api-docs"
            className="block p-4 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 hover:border-gray-900 dark:hover:border-white transition-colors rounded-2xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-900 flex items-center justify-center rounded-xl">
                  <Settings className="w-5 h-5 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    调试面板
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    API测试和系统设置
                  </div>
                </div>
              </div>
              <ExternalLink className="w-5 h-5 text-gray-400" />
            </div>
          </Link>
        </div>

        {/* 危险操作 */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
            账户操作
          </h3>

          {/* 注销按钮 */}
          <button
            onClick={handleLogout}
            disabled={loading}
            className="w-full p-4 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 hover:border-gray-900 dark:hover:border-white transition-colors text-left rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-900 flex items-center justify-center rounded-xl">
                <LogOut className="w-5 h-5 text-gray-900 dark:text-white" />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  注销登录
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  退出当前账户
                </div>
              </div>
            </div>
          </button>

          {/* 删除账户按钮 */}
          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full p-4 bg-white dark:bg-black border border-red-200 dark:border-red-800 hover:border-red-500 dark:hover:border-red-500 transition-colors text-left rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 dark:bg-red-900/20 flex items-center justify-center rounded-xl">
                <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <div className="font-medium text-red-600 dark:text-red-400">
                  删除账户
                </div>
                <div className="text-sm text-red-500 dark:text-red-500">
                  永久删除您的账户和所有数据
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* 删除账户确认弹窗 */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-black border border-red-500 p-6 max-w-md w-full rounded-2xl">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-red-50 dark:bg-red-900/20 mb-4 rounded-xl">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                删除账户
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                此操作不可撤销，将永久删除您的账户和所有数据
              </p>
            </div>

            <form onSubmit={handleDeleteAccount} className="space-y-4">
              {deleteError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <p className="text-sm text-red-600 dark:text-red-400">{deleteError}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  请输入密码以确认
                </label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 dark:text-white"
                  placeholder="输入密码"
                  disabled={loading}
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletePassword('');
                    setDeleteError('');
                  }}
                  className="flex-1 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:border-gray-900 dark:hover:border-white transition-colors rounded-full"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-red-600 dark:bg-red-500 text-white font-medium hover:bg-red-700 dark:hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-full"
                >
                  {loading ? '删除中...' : '确认删除'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
