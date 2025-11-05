import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { configService, syncTriggerService, DetailedSyncResult } from '../services/config';
import BackendLogViewer from '../components/BackendLogViewer';
import { useLiquidGlass } from '../hooks/useLiquidGlass';
import { useMaterialDesign3 } from '../hooks/useMaterialDesign3';
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
  Download,
  ChevronDown,
  ChevronUp,
  Clock,
  AlertCircle,
  BookOpen,
  Sparkles,
  Layers
} from 'lucide-react';

interface SyncResult extends DetailedSyncResult {
  type: string;
  timestamp: Date;
  expanded?: boolean;
}

const SettingsPage = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState(configService.getConfig());
  const [syncResults, setSyncResults] = useState<SyncResult[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const { isEnabled: liquidGlassEnabled, toggle: toggleLiquidGlass } = useLiquidGlass();
  const { isEnabled: md3Enabled, toggle: toggleMD3 } = useMaterialDesign3();

  const handleSave = () => {
    configService.saveConfig(config);
    alert('配置已保存！');
  };

  const addResult = (type: string, result: DetailedSyncResult) => {
    setSyncResults(prev => [
      {
        type,
        ...result,
        timestamp: new Date(),
        expanded: false
      },
      ...prev.slice(0, 19) // 保留最近20条
    ]);
  };

  const handleSync = async (type: string, syncFn: () => Promise<DetailedSyncResult>) => {
    setLoading(type);
    try {
      const result = await syncFn();
      addResult(type, result);
    } catch (error) {
      addResult(type, {
        success: false,
        message: (error as Error).message || '同步失败',
        errorDetails: {
          errorType: 'UnexpectedError',
          errorMessage: (error as Error).message,
          stack: (error as Error).stack
        }
      });
    } finally {
      setLoading(null);
    }
  };

  const toggleExpanded = (index: number) => {
    setSyncResults(prev => prev.map((result, i) =>
      i === index ? { ...result, expanded: !result.expanded } : result
    ));
  };

  const leagues = [
    { id: 'premier-league', name: '英超' },
    { id: 'la-liga', name: '西甲' },
    { id: 'bundesliga', name: '德甲' },
    { id: 'serie-a', name: '意甲' },
    { id: 'ligue-1', name: '法甲' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 pb-20 md:pb-0">
      {/* 头部 */}
      <div className="hero-gradient text-white shadow-xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>返回首页</span>
            </button>
            <button
              onClick={() => navigate('/api-docs')}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-all hover:scale-105 active:scale-95"
            >
              <BookOpen className="w-4 h-4" />
              <span className="text-sm font-medium">API文档</span>
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <Settings className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold drop-shadow-lg">高级设置</h1>
              <p className="text-white/90 text-sm">数据源配置和手动同步</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* LiquidGlass效果设置 - 会员专属 */}
        <section className="glass-card p-6 mb-6 animate-slide-up border-2 border-cyan-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-cyan-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                iOS 16 LiquidGlass效果
              </h2>
              <span className="liquid-badge text-white bg-gradient-to-r from-cyan-500 to-blue-500">
                ✨ 会员专属
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  启用LiquidGlass效果
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  iOS 16风格流动玻璃态UI，极致奢华视觉体验
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={liquidGlassEnabled}
                  onChange={toggleLiquidGlass}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 dark:bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 dark:peer-focus:ring-cyan-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-blue-500"></div>
              </label>
            </div>

            {/* LiquidGlass效果预览 */}
            {liquidGlassEnabled && (
              <div className="animate-fade-in">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">效果预览：</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="liquid-card p-4 text-center">
                    <Sparkles className="w-8 h-8 mx-auto mb-2 text-cyan-500" />
                    <p className="text-sm font-medium">卡片效果</p>
                  </div>
                  <div className="liquid-card p-4 text-center">
                    <div className="liquid-badge mx-auto mb-2">
                      徽章效果
                    </div>
                    <p className="text-sm font-medium">徽章效果</p>
                  </div>
                  <div className="liquid-card p-4 text-center">
                    <button className="liquid-btn">按钮效果</button>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-4 border border-cyan-200 dark:border-cyan-800">
              <div className="flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-cyan-600 dark:text-cyan-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-cyan-900 dark:text-cyan-100 mb-1">
                    会员专属特权
                  </p>
                  <p className="text-xs text-cyan-700 dark:text-cyan-300">
                    LiquidGlass效果采用iOS 16技术，为导航栏、卡片提供流动玻璃质感，开通会员即可体验。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Material Design 3效果设置 - 会员专属 */}
        <section className="glass-card p-6 mb-6 animate-slide-up border-2 border-indigo-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Layers className="w-5 h-5 text-indigo-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Material Design 3效果
              </h2>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500">
                ✨ 会员专属
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  启用Material Design 3效果
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Google官方设计语言，现代化Material You风格UI
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={md3Enabled}
                  onChange={toggleMD3}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 dark:bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-indigo-500 peer-checked:to-purple-500"></div>
              </label>
            </div>

            {/* Material Design 3效果预览 */}
            {md3Enabled && (
              <div className="animate-fade-in">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">效果预览：</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md3-card text-center">
                    <Layers className="w-8 h-8 mx-auto mb-2 text-indigo-500" />
                    <p className="text-sm font-medium">Elevated卡片</p>
                  </div>
                  <div className="md3-card-filled text-center">
                    <div className="md3-chip-filled mx-auto mb-2">
                      Filled芯片
                    </div>
                    <p className="text-sm font-medium">Filled变体</p>
                  </div>
                  <div className="text-center">
                    <button className="md3-btn-filled">Filled按钮</button>
                    <button className="md3-btn-tonal mt-2">Tonal按钮</button>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 border border-indigo-200 dark:border-indigo-800">
              <div className="flex items-start space-x-3">
                <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-indigo-900 dark:text-indigo-100 mb-1">
                    会员专属特权
                  </p>
                  <p className="text-xs text-indigo-700 dark:text-indigo-300">
                    Material Design 3采用Google最新设计规范，提供Surface Elevation、State Layer等现代化交互效果，开通会员即可体验。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* API 配置 */}
        <section className="glass-card p-6 mb-6 animate-slide-up">
          <div className="flex items-center space-x-2 mb-4">
            <Key className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">API 配置</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Football API Key
              </label>
              <input
                type="password"
                value={config.apiKey}
                onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                placeholder="输入你的 API Key"
                className="input"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                从 <a href="https://www.api-football.com/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">api-football.com</a> 获取免费 API Key
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                API 基础URL
              </label>
              <input
                type="text"
                value={config.apiBaseUrl}
                onChange={(e) => setConfig({ ...config, apiBaseUrl: e.target.value })}
                className="input"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  启用自动同步
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">每 {config.syncInterval} 分钟自动更新</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.enableAutoSync}
                  onChange={(e) => setConfig({ ...config, enableAutoSync: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 dark:bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 dark:peer-checked:bg-primary-500"></div>
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
        <section className="glass-card p-6 mb-6 animate-slide-up">
          <div className="flex items-center space-x-2 mb-4">
            <RefreshCw className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">手动同步</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <button
              onClick={() => handleSync('今日比赛', () => syncTriggerService.syncTodayMatches())}
              disabled={loading !== null}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-lg"
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
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-lg"
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              同步联赛积分榜
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {leagues.map(league => (
                <button
                  key={league.id}
                  onClick={() => handleSync(`积分榜-${league.name}`, () => syncTriggerService.syncStandings(league.id))}
                  disabled={loading !== null}
                  className="px-3 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-xl text-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-md"
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
        <section className="glass-card p-6 mb-6 animate-slide-up">
          <div className="flex items-center space-x-2 mb-4">
            <Globe className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">网页爬虫</h2>
            <span className="badge bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">备用方案</span>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            当 API 配额用完时，可以使用爬虫获取数据（可能不稳定）
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={() => handleSync('Google爬虫', () => syncTriggerService.scrapeGoogle())}
              disabled={loading !== null}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-700 hover:bg-gray-800 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-white rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-lg"
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
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-700 hover:bg-gray-800 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-white rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-lg"
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
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-700 hover:bg-gray-800 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-white rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-lg"
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
        <section className="glass-card p-6 mb-6 animate-slide-up">
          <div className="flex items-center space-x-2 mb-4">
            <Database className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">同步日志</h2>
          </div>

          {syncResults.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">暂无同步记录</p>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-thin">
              {syncResults.map((result, index) => (
                <div
                  key={index}
                  className={`rounded-xl border ${
                    result.success
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
                      : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'
                  }`}
                >
                  {/* 主要信息 */}
                  <div className="p-3">
                    <div className="flex items-start space-x-2">
                      {result.success ? (
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900 dark:text-gray-100">{result.type}</span>
                            {result.statusCode && (
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                result.statusCode >= 200 && result.statusCode < 300
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                  : result.statusCode >= 400 && result.statusCode < 500
                                  ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                                  : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                              }`}>
                                {result.statusCode}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {result.timestamp.toLocaleTimeString('zh-CN')}
                            </span>
                            {(result.errorDetails || result.rawResponse || result.endpoint) && (
                              <button
                                onClick={() => toggleExpanded(index)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                              >
                                {result.expanded ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{result.message}</p>
                      </div>
                    </div>
                  </div>

                  {/* 详细信息（可展开） */}
                  {result.expanded && (
                    <div className="px-3 pb-3 border-t border-gray-200 dark:border-gray-700/50 pt-3 mt-2">
                      <div className="space-y-2 text-xs">
                        {/* 基本信息 */}
                        {result.endpoint && (
                          <div className="flex">
                            <span className="font-semibold text-gray-700 dark:text-gray-300 w-24">接口:</span>
                            <code className="flex-1 text-gray-600 dark:text-gray-400 bg-white dark:bg-zinc-800 px-2 py-1 rounded">{result.endpoint}</code>
                          </div>
                        )}
                        {result.apiKey && (
                          <div className="flex">
                            <span className="font-semibold text-gray-700 dark:text-gray-300 w-24">API Key:</span>
                            <code className="flex-1 text-gray-600 dark:text-gray-400 bg-white dark:bg-zinc-800 px-2 py-1 rounded">{result.apiKey}</code>
                          </div>
                        )}
                        {result.requestTime && (
                          <div className="flex">
                            <span className="font-semibold text-gray-700 dark:text-gray-300 w-24">请求时间:</span>
                            <code className="flex-1 text-gray-600 dark:text-gray-400 bg-white dark:bg-zinc-800 px-2 py-1 rounded">{new Date(result.requestTime).toLocaleString('zh-CN')}</code>
                          </div>
                        )}
                        {result.responseTime && (
                          <div className="flex">
                            <span className="font-semibold text-gray-700 dark:text-gray-300 w-24">响应时间:</span>
                            <code className="flex-1 text-gray-600 dark:text-gray-400 bg-white dark:bg-zinc-800 px-2 py-1 rounded">{new Date(result.responseTime).toLocaleString('zh-CN')}</code>
                          </div>
                        )}

                        {/* 错误详情 */}
                        {result.errorDetails && (
                          <div className="mt-3">
                            <div className="flex items-center space-x-1 mb-2">
                              <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400" />
                              <span className="font-semibold text-gray-700 dark:text-gray-300">错误详情:</span>
                            </div>
                            <pre className="bg-white dark:bg-zinc-800 p-3 rounded text-gray-600 dark:text-gray-400 overflow-x-auto scrollbar-thin max-h-48">
{JSON.stringify(result.errorDetails, null, 2)}
                            </pre>
                          </div>
                        )}

                        {/* 响应数据 */}
                        {result.rawResponse && (
                          <div className="mt-3">
                            <span className="font-semibold text-gray-700 dark:text-gray-300 block mb-2">响应数据:</span>
                            <pre className="bg-white dark:bg-zinc-800 p-3 rounded text-gray-600 dark:text-gray-400 overflow-x-auto scrollbar-thin max-h-48">
{JSON.stringify(result.rawResponse, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 后端运行日志 */}
        <BackendLogViewer />

        {/* 危险区域 */}
        <section className="glass-card p-6 mt-6 border-2 border-red-200 dark:border-red-700 animate-slide-up">
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">危险操作</h2>
          <button
            onClick={() => {
              if (confirm('确定要清除所有配置吗？此操作不可恢复！')) {
                configService.clearConfig();
                setConfig(configService.getConfig());
                alert('配置已清除');
              }
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            清除所有配置
          </button>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
