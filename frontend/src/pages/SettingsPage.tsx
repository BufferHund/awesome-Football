import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { configService, syncTriggerService } from '../services/config';
import {
  Settings,
  Key,
  RefreshCw,
  Database,
  Globe,
  CheckCircle,
  XCircle,
  Loader,
  ArrowLeft,
  Download
} from 'lucide-react';

interface SyncResult {
  type: string;
  success: boolean;
  message: string;
  timestamp: Date;
}

const SettingsPage = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState(configService.getConfig());
  const [syncResults, setSyncResults] = useState<SyncResult[]>([]);
  const [loading, setLoading] = useState<string | null>(null);

  const handleSave = () => {
    configService.saveConfig(config);
    alert('配置已保存！');
  };

  const addResult = (type: string, success: boolean, message: string) => {
    setSyncResults(prev => [
      { type, success, message, timestamp: new Date() },
      ...prev.slice(0, 9) // 只保留最近10条
    ]);
  };

  const handleSync = async (type: string, syncFn: () => Promise<any>) => {
    setLoading(type);
    try {
      const result = await syncFn();
      addResult(type, result.success !== false, result.message || '同步成功');
    } catch (error) {
      addResult(type, false, (error as Error).message || '同步失败');
    } finally {
      setLoading(null);
    }
  };

  const leagues = [
    { id: 'premier-league', name: '英超' },
    { id: 'la-liga', name: '西甲' },
    { id: 'bundesliga', name: '德甲' },
    { id: 'serie-a', name: '意甲' },
    { id: 'ligue-1', name: '法甲' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      {/* 头部 */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-white/80 hover:text-white mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回首页</span>
          </button>
          <div className="flex items-center space-x-3">
            <Settings className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold">高级设置</h1>
              <p className="text-green-100 text-sm">数据源配置和手动同步</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* API 配置 */}
        <section className="card p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Key className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-bold">API 配置</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Football API Key
              </label>
              <input
                type="password"
                value={config.apiKey}
                onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                placeholder="输入你的 API Key"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                从 <a href="https://www.api-football.com/" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">api-football.com</a> 获取免费 API Key
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API 基础URL
              </label>
              <input
                type="text"
                value={config.apiBaseUrl}
                onChange={(e) => setConfig({ ...config, apiBaseUrl: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  启用自动同步
                </label>
                <p className="text-xs text-gray-500">每 {config.syncInterval} 分钟自动更新</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.enableAutoSync}
                  onChange={(e) => setConfig({ ...config, enableAutoSync: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            <button
              onClick={handleSave}
              className="w-full btn-primary"
            >
              保存配置
            </button>
          </div>
        </section>

        {/* 手动同步 */}
        <section className="card p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <RefreshCw className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-bold">手动同步</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <button
              onClick={() => handleSync('今日比赛', () => syncTriggerService.syncTodayMatches())}
              disabled={loading !== null}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
            >
              {loading === '今日比赛' ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Database className="w-4 h-4" />
              )}
              <span>同步今日比赛</span>
            </button>

            <button
              onClick={() => handleSync('直播比赛', () => syncTriggerService.syncLiveMatches())}
              disabled={loading !== null}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50"
            >
              {loading === '直播比赛' ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Database className="w-4 h-4" />
              )}
              <span>同步直播比赛</span>
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              同步联赛积分榜
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {leagues.map(league => (
                <button
                  key={league.id}
                  onClick={() => handleSync(`积分榜-${league.name}`, () => syncTriggerService.syncStandings(league.id))}
                  disabled={loading !== null}
                  className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition disabled:opacity-50"
                >
                  {loading === `积分榜-${league.name}` ? (
                    <Loader className="w-4 h-4 animate-spin mx-auto" />
                  ) : (
                    league.name
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 爬虫功能 */}
        <section className="card p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Globe className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-bold">网页爬虫</h2>
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">备用方案</span>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            当 API 配额用完时，可以使用爬虫获取数据（可能不稳定）
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={() => handleSync('Google爬虫', () => syncTriggerService.scrapeGoogle())}
              disabled={loading !== null}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition disabled:opacity-50"
            >
              {loading === 'Google爬虫' ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>Google</span>
            </button>

            <button
              onClick={() => handleSync('FlashScore爬虫', () => syncTriggerService.scrapeFlashScore())}
              disabled={loading !== null}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition disabled:opacity-50"
            >
              {loading === 'FlashScore爬虫' ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>FlashScore</span>
            </button>

            <button
              onClick={() => handleSync('ESPN爬虫', () => syncTriggerService.scrapeESPN())}
              disabled={loading !== null}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition disabled:opacity-50"
            >
              {loading === 'ESPN爬虫' ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>ESPN</span>
            </button>
          </div>
        </section>

        {/* 同步日志 */}
        <section className="card p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Database className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-bold">同步日志</h2>
          </div>

          {syncResults.length === 0 ? (
            <p className="text-gray-500 text-center py-8">暂无同步记录</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {syncResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    result.success
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {result.success ? (
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{result.type}</span>
                        <span className="text-xs text-gray-500">
                          {result.timestamp.toLocaleTimeString('zh-CN')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{result.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 危险区域 */}
        <section className="card p-6 mt-6 border-2 border-red-200">
          <h2 className="text-xl font-bold text-red-600 mb-4">危险操作</h2>
          <button
            onClick={() => {
              if (confirm('确定要清除所有配置吗？此操作不可恢复！')) {
                configService.clearConfig();
                setConfig(configService.getConfig());
                alert('配置已清除');
              }
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
          >
            清除所有配置
          </button>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
