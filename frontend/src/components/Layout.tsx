import { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Trophy, Users, Newspaper, ShoppingBag, Crown, MessageSquare, User as UserIcon, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ThemeToggle from './ThemeToggle';
import { themeService } from '../services/theme';
import { useAuth } from '../contexts/AuthContext';

const Layout = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [clickCount, setClickCount] = useState(0);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    themeService.initTheme();
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // 隐藏的彩蛋：点击 logo 7 次进入设置页面
  const handleLogoClick = () => {
    setClickCount(prev => prev + 1);

    // 清除之前的定时器
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    // 2秒后重置计数
    clickTimeoutRef.current = setTimeout(() => {
      setClickCount(0);
    }, 2000);

    // 点击7次触发
    if (clickCount + 1 === 7) {
      setClickCount(0);
      navigate('/secret-settings-panel');
    }
  };

  const navItems = [
    { path: '/', label: t('nav.home'), icon: Home },
    { path: '/matches', label: t('nav.matches'), icon: Trophy },
    { path: '/teams', label: t('nav.teams'), icon: Users },
    { path: '/news', label: t('nav.news'), icon: Newspaper },
    { path: '/forum', label: t('nav.forum'), icon: MessageSquare },
    { path: '/leaderboard', label: '排行榜', icon: Award },
    { path: '/shop', label: t('nav.shop'), icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen flex flex-col relative bg-white dark:bg-black">
      {/* 顶部导航栏 - The Verge极简风格 */}
      <header className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div
              onClick={handleLogoClick}
              className="flex items-center gap-2 cursor-pointer select-none group"
            >
              <Trophy className="w-5 h-5 text-gray-900 dark:text-white" />
              <span className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">{t('home.title')}</span>
              {clickCount > 0 && clickCount < 7 && (
                <span className="text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded font-medium">
                  {clickCount}/7
                </span>
              )}
            </div>

            <div className="flex items-center gap-6">
              <nav className="hidden md:flex items-center gap-6">
                {navItems.map(({ path, label, icon: Icon }) => (
                    <Link
                    key={path}
                    to={path}
                    className={`
                      text-sm font-medium transition-colors
                      ${isActive(path)
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }
                    `}
                  >
                    {label}
                  </Link>
                ))}
              </nav>

              <ThemeToggle />

              {/* 用户认证按钮 */}
              {isAuthenticated && user ? (
                user.membershipTier !== 'FREE' ? (
                  // 会员用户：显示VIP标志（黑色风格）
                  <Link
                    to="/profile"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors rounded-full"
                    title={`${user.username} - ${user.membershipTier}`}
                  >
                    <Crown className="w-4 h-4" />
                    <span className="text-sm font-bold">VIP</span>
                  </Link>
                ) : (
                  // 普通用户：显示头像
                  <Link
                    to="/profile"
                    className="flex items-center justify-center w-9 h-9 bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors rounded-full overflow-hidden"
                    title={user.username}
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-5 h-5 text-gray-900 dark:text-white" />
                    )}
                  </Link>
                )
              ) : (
                // 未登录：显示登录按钮
                <Link
                  to="/login"
                  className="px-4 py-1.5 text-sm font-medium bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors rounded-full"
                >
                  登录
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="flex-1 container mx-auto px-4 py-8 relative z-10 animate-fade-in">
        <Outlet />
      </main>

      {/* 底部导航（移动端）- The Verge极简风格 */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 z-50 safe-area-bottom">
        <div className="flex justify-around px-4 py-2">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`
                flex flex-col items-center py-2 px-2 flex-1 text-[10px] font-medium
                transition-colors
                ${isActive(path)
                  ? 'text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400'
                }
              `}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive(path) ? 'stroke-[2]' : 'stroke-[1.5]'}`} />
              <span className="truncate w-full text-center">{label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* 底部信息 - The Verge极简风格 */}
      <footer className="bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 py-12 mb-16 md:mb-0 relative z-10">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Trophy className="w-5 h-5 text-gray-900 dark:text-white" />
              <span className="text-lg font-bold text-gray-900 dark:text-white">{t('home.title')}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">全球球迷聚集地</p>
            <p className="text-xs text-gray-400 dark:text-gray-600">&copy; 2025 {t('home.title')}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
