import { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Trophy, Users, Newspaper, ShoppingBag, Crown, MessageSquare } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { themeService } from '../services/theme';
import { useLiquidGlass } from '../hooks/useLiquidGlass';
import { useMaterialDesign3 } from '../hooks/useMaterialDesign3';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [clickCount, setClickCount] = useState(0);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { isEnabled: liquidGlassEnabled } = useLiquidGlass();
  const { isEnabled: md3Enabled } = useMaterialDesign3();

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
    { path: '/forum', label: '论坛', icon: MessageSquare },
    { path: '/shop', label: '商城', icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* 装饰性背景 */}
      <div className="fixed inset-0 grid-bg opacity-50 pointer-events-none"></div>

      {/* 顶部导航栏 - 扁平化设计 */}
      <header className={`${
        liquidGlassEnabled
          ? 'liquid-nav'
          : md3Enabled
          ? 'md3-nav'
          : 'bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-gray-200/80 dark:border-zinc-800/80'
      } sticky top-0 z-50`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div
              onClick={handleLogoClick}
              className="flex items-center gap-3 cursor-pointer select-none group"
            >
              <div className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-sm group-hover:shadow-md transition-all">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">足球世界</span>
              {clickCount > 0 && clickCount < 7 && (
                <span className="text-xs badge badge-live">
                  {clickCount}/7
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map(({ path, label, icon: Icon }) => (
                    <Link
                    key={path}
                    to={path}
                    className={`
                      flex items-center gap-2 px-3 py-2 text-sm font-medium
                      transition-all duration-200
                      ${md3Enabled
                        ? `md3-nav-item ${isActive(path) ? 'md3-nav-item-active' : ''}`
                        : `rounded-lg ${isActive(path)
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800/50'
                        }`
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
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200"
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

      {/* 底部导航（移动端）- 扁平化设计 */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 ${
        liquidGlassEnabled
          ? 'liquid-nav'
          : md3Enabled
          ? 'md3-bottom-nav'
          : 'bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border-t border-gray-200 dark:border-zinc-800'
      } z-50 safe-area-bottom`}>
        <div className="flex justify-around px-2 py-1">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`
                flex flex-col items-center py-2 px-3 flex-1 text-xs font-medium
                transition-all duration-200
                ${md3Enabled
                  ? `md3-bottom-nav-item ${isActive(path) ? 'md3-bottom-nav-item-active' : ''}`
                  : `rounded-lg ${isActive(path)
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-400'
                  }`
                }
              `}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive(path) ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* 底部信息 */}
      <footer className="bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 py-8 mb-16 md:mb-0 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">&copy; 2025 足球世界. 专业的足球资讯平台</p>
            <p className="text-xs mt-2 text-gray-400 dark:text-gray-600">Powered by Modern React</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
