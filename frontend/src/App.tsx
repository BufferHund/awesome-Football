import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import MatchesPage from './pages/MatchesPage';
import MatchDetailPage from './pages/MatchDetailPage';
import StandingsPage from './pages/StandingsPage';
import TeamsPage from './pages/TeamsPage';
import TeamDetailPage from './pages/TeamDetailPage';
import NewsPage from './pages/NewsPage';
import NewsDetailPage from './pages/NewsDetailPage';
import ForumPage from './pages/ForumPage';
import ForumPostPage from './pages/ForumPostPage';
import SettingsPage from './pages/SettingsPage';
import ApiDocsPage from './pages/ApiDocsPage';
import MembershipPage from './pages/MembershipPage';
import ShopPage from './pages/ShopPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import LeaderboardPage from './pages/LeaderboardPage';

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
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
                <Route path="forum" element={<ForumPage />} />
                <Route path="forum/:id" element={<ForumPostPage />} />
                <Route path="shop" element={<ShopPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="leaderboard" element={<LeaderboardPage />} />
              </Route>
              {/* 登录页面 - 独立路由 */}
              <Route path="/login" element={<LoginPage />} />
              {/* 隐藏的设置页面 - 独立路由 */}
              <Route path="/secret-settings-panel" element={<SettingsPage />} />
              {/* API文档和调试页面 */}
              <Route path="/api-docs" element={<ApiDocsPage />} />
              {/* 会员购买页面 */}
              <Route path="/membership" element={<MembershipPage />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
