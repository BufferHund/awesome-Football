import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Trophy, Users, Newspaper, TrendingUp } from 'lucide-react';

const Layout = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
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
            <Link to="/" className="flex items-center space-x-2">
              <Trophy className="w-8 h-8" />
              <span className="text-2xl font-bold">足球世界</span>
            </Link>

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
