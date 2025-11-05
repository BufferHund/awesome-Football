import { useState, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Trophy, Users, Newspaper, TrendingUp } from 'lucide-react';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [clickCount, setClickCount] = useState(0);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    { path: '/standings', label: '积分榜', icon: TrendingUp },
    { path: '/teams', label: '球队', icon: Users },
    { path: '/news', label: '新闻', icon: Newspaper },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* 顶部导航栏 */}
      <header className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div
              onClick={handleLogoClick}
              className="flex items-center space-x-2 cursor-pointer select-none"
            >
              <Trophy className="w-8 h-8" />
              <span className="text-2xl font-bold">足球世界</span>
              {clickCount > 0 && clickCount < 7 && (
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full animate-pulse">
                  {clickCount}/7
                </span>
              )}
            </div>

            <nav className="hidden md:flex space-x-1">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-colors ${
                    isActive(path)
                      ? 'bg-white/20 font-semibold'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* 底部导航（移动端） */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex justify-around">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center py-3 px-4 flex-1 ${
                isActive(path)
                  ? 'text-green-600'
                  : 'text-gray-600'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs mt-1">{label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* 底部信息 */}
      <footer className="bg-gray-800 text-gray-300 py-6 mb-16 md:mb-0">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 足球世界. 专业的足球资讯平台</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
