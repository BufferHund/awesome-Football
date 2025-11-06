import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Trophy, Mail, Lock, User, AlertCircle } from 'lucide-react';

type TabType = 'login' | 'register';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 登录表单
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  // 注册表单
  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    password: '',
  });

  // 表单验证
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateLoginForm = () => {
    const errors: Record<string, string> = {};

    if (!loginForm.email) {
      errors.email = '请输入邮箱';
    } else if (!/\S+@\S+\.\S+/.test(loginForm.email)) {
      errors.email = '邮箱格式不正确';
    }

    if (!loginForm.password) {
      errors.password = '请输入密码';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateRegisterForm = () => {
    const errors: Record<string, string> = {};

    if (!registerForm.username) {
      errors.username = '请输入用户名';
    } else if (registerForm.username.length < 3 || registerForm.username.length > 20) {
      errors.username = '用户名长度需在3-20个字符之间';
    }

    if (!registerForm.email) {
      errors.email = '请输入邮箱';
    } else if (!/\S+@\S+\.\S+/.test(registerForm.email)) {
      errors.email = '邮箱格式不正确';
    }

    if (!registerForm.password) {
      errors.password = '请输入密码';
    } else if (registerForm.password.length < 6) {
      errors.password = '密码长度至少6个字符';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setValidationErrors({});

    if (!validateLoginForm()) {
      return;
    }

    setLoading(true);
    try {
      await login(loginForm.email, loginForm.password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || '登录失败，请检查邮箱和密码');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setValidationErrors({});

    if (!validateRegisterForm()) {
      return;
    }

    setLoading(true);
    try {
      await register(registerForm.username, registerForm.email, registerForm.password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || '注册失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 dark:bg-white mb-4 rounded-2xl">
            <Trophy className="w-8 h-8 text-white dark:text-black" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            欢迎回来
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            登录或注册以继续
          </p>
        </div>

        {/* 标签页切换 */}
        <div className="flex bg-gray-100 dark:bg-gray-900 p-1 mb-6 rounded-full">
          <button
            onClick={() => {
              setActiveTab('login');
              setError('');
              setValidationErrors({});
            }}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors rounded-full ${
              activeTab === 'login'
                ? 'bg-white dark:bg-black text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            登录
          </button>
          <button
            onClick={() => {
              setActiveTab('register');
              setError('');
              setValidationErrors({});
            }}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors rounded-full ${
              activeTab === 'register'
                ? 'bg-white dark:bg-black text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            注册
          </button>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          </div>
        )}

        {/* 登录表单 */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                邮箱
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  className={`w-full pl-12 pr-4 py-3 bg-white dark:bg-black border rounded-xl focus:outline-none focus:ring-2 text-gray-900 dark:text-white ${
                    validationErrors.email
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 dark:border-gray-700 focus:ring-gray-900 dark:focus:ring-white'
                  }`}
                  placeholder="your@email.com"
                  disabled={loading}
                />
              </div>
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {validationErrors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className={`w-full pl-12 pr-4 py-3 bg-white dark:bg-black border rounded-xl focus:outline-none focus:ring-2 text-gray-900 dark:text-white ${
                    validationErrors.password
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 dark:border-gray-700 focus:ring-gray-900 dark:focus:ring-white'
                  }`}
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
              {validationErrors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {validationErrors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-black font-medium hover:bg-gray-700 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-full"
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </form>
        )}

        {/* 注册表单 */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                用户名
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={registerForm.username}
                  onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                  className={`w-full pl-12 pr-4 py-3 bg-white dark:bg-black border rounded-xl focus:outline-none focus:ring-2 text-gray-900 dark:text-white ${
                    validationErrors.username
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 dark:border-gray-700 focus:ring-gray-900 dark:focus:ring-white'
                  }`}
                  placeholder="3-20个字符"
                  disabled={loading}
                />
              </div>
              {validationErrors.username && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {validationErrors.username}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                邮箱
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  className={`w-full pl-12 pr-4 py-3 bg-white dark:bg-black border rounded-xl focus:outline-none focus:ring-2 text-gray-900 dark:text-white ${
                    validationErrors.email
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 dark:border-gray-700 focus:ring-gray-900 dark:focus:ring-white'
                  }`}
                  placeholder="your@email.com"
                  disabled={loading}
                />
              </div>
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {validationErrors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  className={`w-full pl-12 pr-4 py-3 bg-white dark:bg-black border rounded-xl focus:outline-none focus:ring-2 text-gray-900 dark:text-white ${
                    validationErrors.password
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 dark:border-gray-700 focus:ring-gray-900 dark:focus:ring-white'
                  }`}
                  placeholder="至少6个字符"
                  disabled={loading}
                />
              </div>
              {validationErrors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {validationErrors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-black font-medium hover:bg-gray-700 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-full"
            >
              {loading ? '注册中...' : '注册'}
            </button>
          </form>
        )}

        {/* 返回首页 */}
        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
