import { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Trophy, Users, Newspaper, ShoppingBag, Crown, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ThemeToggle from './ThemeToggle';
import { themeService } from '../services/theme';
import { useLiquidGlass } from '../hooks/useLiquidGlass';
import { useMaterialDesign3 } from '../hooks/useMaterialDesign3';

const Layout = () => {
  const { t } = useTranslation();
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
    { path: '/', label: t('nav.home'), icon: Home },
    { path: '/matches', label: t('nav.matches'), icon: Trophy },
    { path: '/teams', label: t('nav.teams'), icon: Users },
    { path: '/news', label: t('nav.news'), icon: Newspaper },
    { path: '/forum', label: t('nav.forum'), icon: MessageSquare },
    { path: '/shop', label: t('nav.shop'), icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen flex flex-col relative bg-gray-50 dark:bg-dark-100">
      {/* 体育风格背景 - 足球场纹理 */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')]"></div>

      {/* 顶部导航栏 - 专业体育平台风格 */}
      <header className={`${
        liquidGlassEnabled
          ? 'liquid-nav'
          : md3Enabled
          ? 'md3-nav'
          : 'bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 dark:from-green-700 dark:via-emerald-700 dark:to-teal-700'
      } sticky top-0 z-50 shadow-lg shadow-green-500/20`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div
              onClick={handleLogoClick}
              className="flex items-center gap-3 cursor-pointer select-none group"
            >
              <div className="relative w-10 h-10 flex items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                <Trophy className="w-6 h-6 text-white drop-shadow-lg" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-black text-white tracking-tight drop-shadow-md">{t('home.title')}</span>
                <span className="text-[10px] text-white/80 font-medium -mt-1 hidden md:block">全球球迷聚集地</span>
              </div>
              {clickCount > 0 && clickCount < 7 && (
                <span className="text-xs px-2 py-0.5 bg-white/20 backdrop-blur-sm text-white rounded-full font-bold">
                  {clickCount}/7
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <nav className="hidden md:flex items-center gap-2">
                {navItems.map(({ path, label, icon: Icon }) => (
                    <Link
                    key={path}
                    to={path}
                    className={`
                      flex items-center gap-2 px-4 py-2 text-sm font-bold
                      transition-all duration-200 rounded-xl
                      ${md3Enabled
                        ? `md3-nav-item ${isActive(path) ? 'md3-nav-item-active' : ''}`
                        : isActive(path)
                          ? 'bg-white/25 backdrop-blur-sm text-white shadow-lg scale-105'
                          : 'text-white/90 hover:text-white hover:bg-white/15 hover:scale-105'
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
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-white text-sm font-black shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 hover:scale-105 transition-all duration-200"
              >
                <Crown className="w-4 h-4" />
                <span className="hidden lg:inline">{t('nav.membership')}</span>
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

      {/* 底部导航（移动端）- 专业体育平台风格 */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 ${
        liquidGlassEnabled
          ? 'liquid-nav'
          : md3Enabled
          ? 'md3-bottom-nav'
          : 'bg-white/95 dark:bg-dark-200/95 backdrop-blur-xl border-t-2 border-green-500/20 dark:border-green-500/30'
      } z-50 safe-area-bottom shadow-2xl shadow-green-500/10`}>
        <div className="flex justify-around px-2 py-2">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`
                flex flex-col items-center py-2 px-2 flex-1 text-[10px] font-bold
                transition-all duration-200 rounded-xl
                ${md3Enabled
                  ? `md3-bottom-nav-item ${isActive(path) ? 'md3-bottom-nav-item-active' : ''}`
                  : isActive(path)
                    ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 scale-105'
                    : 'text-gray-600 dark:text-gray-400'
                }
              `}
            >
              <Icon className={`w-6 h-6 mb-1 ${isActive(path) ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="truncate w-full text-center">{label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* 底部信息 - 专业体育平台风格 */}
      <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-dark-300 dark:via-dark-200 dark:to-dark-300 py-12 mb-16 md:mb-0 relative z-10 border-t border-gray-700 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black text-white">{t('home.title')}</span>
            </div>
            <p className="text-sm text-gray-400 mb-2">全球球迷聚集地 · 实时足球资讯平台</p>
            <p className="text-xs text-gray-500">&copy; 2025 {t('home.title')}. All rights reserved.</p>
            <p className="text-xs mt-3 text-gray-600">Powered by Modern Football Technology</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
