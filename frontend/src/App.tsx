import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import MatchesPage from './pages/MatchesPage';
import MatchDetailPage from './pages/MatchDetailPage';
import StandingsPage from './pages/StandingsPage';
import TeamsPage from './pages/TeamsPage';
import TeamDetailPage from './pages/TeamDetailPage';
import NewsPage from './pages/NewsPage';
import NewsDetailPage from './pages/NewsDetailPage';
import SettingsPage from './pages/SettingsPage';
import ApiDocsPage from './pages/ApiDocsPage';
import MembershipPage from './pages/MembershipPage';
import SplashAd from './components/SplashAd';

function App() {
  const [showSplashAd, setShowSplashAd] = useState(false);

  useEffect(() => {
    // 检查是否需要显示开屏广告
    const checkSplashAd = () => {
      const lastShown = localStorage.getItem('splashAdLastShown');
      const today = new Date().toDateString();

      // 如果今天还没显示过，或者是首次访问，则显示广告
      if (!lastShown || lastShown !== today) {
        setShowSplashAd(true);
      }
    };

    checkSplashAd();
  }, []);

  const handleCloseSplashAd = () => {
    // 记录广告已显示
    const today = new Date().toDateString();
    localStorage.setItem('splashAdLastShown', today);
    setShowSplashAd(false);
  };

  return (
    <>
      {/* 开屏广告 */}
      {showSplashAd && <SplashAd onClose={handleCloseSplashAd} />}

      {/* 主应用内容 */}
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="matches" element={<MatchesPage />} />
            <Route path="matches/:id" element={<MatchDetailPage />} />
            <Route path="standings" element={<StandingsPage />} />
            <Route path="teams" element={<TeamsPage />} />
            <Route path="teams/:id" element={<TeamDetailPage />} />
            <Route path="news" element={<NewsPage />} />
            <Route path="news/:id" element={<NewsDetailPage />} />
          </Route>
          {/* 隐藏的设置页面 - 独立路由 */}
          <Route path="/secret-settings-panel" element={<SettingsPage />} />
          {/* API文档和调试页面 */}
          <Route path="/api-docs" element={<ApiDocsPage />} />
          {/* 会员购买页面 */}
          <Route path="/membership" element={<MembershipPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
