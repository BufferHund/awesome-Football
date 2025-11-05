import { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Trophy, Users, Newspaper, ShoppingBag, Crown } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { themeService } from '../services/theme';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
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
    { path: '/', label: '首页', icon: Home },
    { path: '/matches', label: '比赛', icon: Trophy },
    { path: '/teams', label: '球队', icon: Users },
    { path: '/news', label: '新闻', icon: Newspaper },
    { path: '/shop', label: '商城', icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* 装饰性背景 */}
      <div className="fixed inset-0 grid-bg opacity-50 pointer-events-none"></div>

      {/* 顶部导航栏 - 玻璃态效果 */}
      <header className="glass-bg border-b border-gray-200/50 dark:border-gray-700/50 shadow-xl sticky top-0 z-50 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div
              onClick={handleLogoClick}
              className="flex items-center space-x-2 cursor-pointer select-none group"
            >
              <div className="relative">
                <Trophy className="w-8 h-8 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 bg-primary-500/20 blur-xl group-hover:bg-primary-500/40 transition-all"></div>
              </div>
              <span className="text-2xl font-bold gradient-text">足球世界</span>
              {clickCount > 0 && clickCount < 7 && (
                <span className="text-xs badge badge-live">
                  {clickCount}/7
                </span>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex space-x-2">
                {navItems.map(({ path, label, icon: Icon }) => (
                    <Link
                    key={path}
                    to={path}
                    className={`
                      flex items-center space-x-2 px-4 py-2 rounded-xl
                      font-medium transition-all duration-300
                      ${isActive(path)
                        ? 'bg-primary-500/20 text-primary-700 dark:text-primary-300 shadow-lg scale-105'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-dark-200/50'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </Link>
                ))}
              </nav>

              <Link
                to="/membership"
                className="flex items-center space-x-1 px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <Crown className="w-4 h-4" />
                <span className="hidden lg:inline">会员</span>
              </Link>

              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="flex-1 container mx-auto px-4 py-8 relative z-10 animate-fade-in">
        <Outlet />
      </main>

      {/* 底部导航（移动端）- 玻璃态效果 */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-bg border-t border-gray-200/50 dark:border-gray-700/50 shadow-2xl backdrop-blur-2xl z-50">
        <div className="flex justify-around p-2">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`
                flex flex-col items-center py-2 px-3 flex-1 rounded-xl
                transition-all duration-300
                ${isActive(path)
                  ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 scale-105'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-dark-200/50'
                }
              `}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs mt-1 font-medium">{label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* 底部信息 */}
      <footer className="bg-gray-100 dark:bg-zinc-900 text-gray-600 dark:text-gray-400 py-8 mb-20 md:mb-0 relative z-10">
        <div className="container mx-auto px-4">
          <div className="divider mb-6"></div>
          <div className="text-center">
            <p className="text-sm">&copy; 2025 足球世界. 专业的足球资讯平台</p>
            <p className="text-xs mt-2 opacity-60">Powered by NextUI inspired design</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
