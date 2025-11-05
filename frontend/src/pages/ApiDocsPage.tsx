import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  ArrowLeft,
  Play,
  CheckCircle,
  XCircle,
  Loader,
  Code,
  ChevronDown,
  ChevronUp,
  Database,
  Globe,
  Activity,
  FileText
} from 'lucide-react';

interface ApiEndpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'DELETE';
  path: string;
  category: 'sync' | 'scraper' | 'logs' | 'data';
  description: string;
  params?: { name: string; type: string; required: boolean; description: string }[];
  example?: any;
}

interface TestResult {
  endpoint: string;
  success: boolean;
  status?: number;
  data?: any;
  error?: string;
  timestamp: Date;
}

const ApiDocsPage = () => {
  const navigate = useNavigate();
  const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState<string | null>(null);

  const endpoints: ApiEndpoint[] = [
    // 数据同步 API
    {
      id: 'sync-today',
      name: '同步今日比赛',
      method: 'POST',
      path: '/api/sync/matches/today',
      category: 'sync',
      description: '从Football API同步今天的所有比赛数据',
      example: {
        message: '今日比赛同步完成',
        success: true
      }
    },
    {
      id: 'sync-live',
      name: '同步直播比赛',
      method: 'POST',
      path: '/api/sync/matches/live',
      category: 'sync',
      description: '同步当前正在进行的比赛实时数据',
      example: {
        message: '直播比赛同步完成',
        success: true
      }
    },
    {
      id: 'sync-standings',
      name: '同步联赛积分榜',
      method: 'POST',
      path: '/api/sync/standings/:leagueId',
      category: 'sync',
      description: '同步指定联赛的积分榜数据',
      params: [
        { name: 'leagueId', type: 'string', required: true, description: '联赛ID (premier-league, la-liga, bundesliga, serie-a, ligue-1)' }
      ],
      example: {
        message: '积分榜同步完成',
        success: true
      }
    },

    // 爬虫 API
    {
      id: 'scrape-google',
      name: 'Google足球爬虫',
      method: 'POST',
      path: '/api/sync/scrape/google',
      category: 'scraper',
      description: '使用Google搜索爬取足球比赛数据（备用方案）',
      example: {
        message: 'Google爬虫执行完成',
        success: true
      }
    },
    {
      id: 'scrape-flashscore',
      name: 'FlashScore爬虫',
      method: 'POST',
      path: '/api/sync/scrape/flashscore',
      category: 'scraper',
      description: '从FlashScore网站爬取比赛数据',
      example: {
        message: 'FlashScore爬虫执行完成',
        success: true
      }
    },
    {
      id: 'scrape-espn',
      name: 'ESPN爬虫',
      method: 'POST',
      path: '/api/sync/scrape/espn',
      category: 'scraper',
      description: '从ESPN网站爬取比赛数据',
      example: {
        message: 'ESPN爬虫执行完成',
        success: true
      }
    },

    // 日志 API
    {
      id: 'logs-get',
      name: '获取日志列表',
      method: 'GET',
      path: '/api/logs',
      category: 'logs',
      description: '获取后端运行日志，支持过滤',
      params: [
        { name: 'level', type: 'string', required: false, description: '日志级别 (success, error, warn, info, debug)' },
        { name: 'source', type: 'string', required: false, description: '日志来源' },
        { name: 'limit', type: 'number', required: false, description: '返回数量限制' },
        { name: 'search', type: 'string', required: false, description: '搜索关键词' }
      ],
      example: {
        success: true,
        logs: [
          {
            id: 'log-1',
            timestamp: '2025-11-05T15:00:00.000Z',
            level: 'success',
            source: 'Server',
            message: '服务器启动成功',
            details: {}
          }
        ],
        count: 1
      }
    },
    {
      id: 'logs-stats',
      name: '获取日志统计',
      method: 'GET',
      path: '/api/logs/stats',
      category: 'logs',
      description: '获取日志统计信息（按级别、来源分类）',
      example: {
        success: true,
        stats: {
          total: 100,
          byLevel: { success: 50, error: 10, warn: 20, info: 15, debug: 5 },
          bySource: { Server: 10, Sync: 60, Scraper: 30 }
        }
      }
    },
    {
      id: 'logs-clear',
      name: '清空所有日志',
      method: 'DELETE',
      path: '/api/logs',
      category: 'logs',
      description: '清空所有后端日志记录',
      example: {
        success: true,
        message: '日志已清空'
      }
    },

    // 数据查询 API
    {
      id: 'matches-today',
      name: '获取今日比赛',
      method: 'GET',
      path: '/api/matches/today',
      category: 'data',
      description: '获取今天的所有比赛数据',
      example: {
        matches: [
          {
            id: 1,
            homeTeam: '曼联',
            awayTeam: '利物浦',
            homeScore: 2,
            awayScore: 1,
            status: 'FT',
            date: '2025-11-05T15:00:00.000Z'
          }
        ]
      }
    },
    {
      id: 'matches-live',
      name: '获取直播比赛',
      method: 'GET',
      path: '/api/matches/live',
      category: 'data',
      description: '获取正在进行的比赛',
      example: {
        matches: [
          {
            id: 2,
            homeTeam: '切尔西',
            awayTeam: '阿森纳',
            homeScore: 1,
            awayScore: 1,
            status: 'LIVE',
            minute: 65
          }
        ]
      }
    },
    {
      id: 'news',
      name: '获取足球新闻',
      method: 'GET',
      path: '/api/news',
      category: 'data',
      description: '获取最新的足球新闻',
      example: {
        news: [
          {
            id: 1,
            title: '曼联签下新援',
            content: '...',
            publishedAt: '2025-11-05T10:00:00.000Z'
          }
        ]
      }
    }
  ];

  const categories = [
    { id: 'sync', name: '数据同步', icon: Database, color: 'blue' },
    { id: 'scraper', name: '网页爬虫', icon: Globe, color: 'gray' },
    { id: 'logs', name: '日志管理', icon: FileText, color: 'purple' },
    { id: 'data', name: '数据查询', icon: Activity, color: 'green' }
  ];

  const testEndpoint = async (endpoint: ApiEndpoint, params?: Record<string, any>) => {
    setLoading(endpoint.id);

    try {
      let url = endpoint.path;

      // 替换路径参数
      if (params && endpoint.params) {
        endpoint.params.forEach(param => {
          if (params[param.name]) {
            url = url.replace(`:${param.name}`, params[param.name]);
          }
        });
      }

      const options: RequestInit = {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const response = await fetch(url, options);
      const data = await response.json();

      const result: TestResult = {
        endpoint: endpoint.name,
        success: response.ok,
        status: response.status,
        data: data,
        timestamp: new Date()
      };

      setTestResults(prev => [result, ...prev.slice(0, 9)]);
    } catch (error) {
      const result: TestResult = {
        endpoint: endpoint.name,
        success: false,
        error: (error as Error).message,
        timestamp: new Date()
      };

      setTestResults(prev => [result, ...prev.slice(0, 9)]);
    } finally {
      setLoading(null);
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'POST': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'DELETE': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300';
    }
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    switch (category?.color) {
      case 'blue': return 'text-blue-600 dark:text-blue-400';
      case 'gray': return 'text-gray-600 dark:text-gray-400';
      case 'purple': return 'text-purple-600 dark:text-purple-400';
      case 'green': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

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
              onClick={() => navigate('/secret-settings-panel')}
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
            >
              <span className="text-sm">前往设置页面</span>
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <BookOpen className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold drop-shadow-lg">API 文档</h1>
              <p className="text-white/90 text-sm">后端接口文档和调试工具</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* API 端点列表 */}
          <div className="lg:col-span-2 space-y-4">
            {categories.map(category => {
              const categoryEndpoints = endpoints.filter(e => e.category === category.id);
              const Icon = category.icon;

              return (
                <section key={category.id} className="glass-card p-6 animate-slide-up">
                  <div className="flex items-center space-x-2 mb-4">
                    <Icon className={`w-5 h-5 ${getCategoryColor(category.id)}`} />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{category.name}</h2>
                    <span className="badge bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300">
                      {categoryEndpoints.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {categoryEndpoints.map(endpoint => (
                      <div
                        key={endpoint.id}
                        className="border border-gray-200 dark:border-zinc-700 rounded-xl overflow-hidden hover:border-primary-500 dark:hover:border-primary-400 transition-colors"
                      >
                        {/* 端点头部 */}
                        <div className="p-4 bg-white dark:bg-zinc-800/50">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${getMethodColor(endpoint.method)}`}>
                                  {endpoint.method}
                                </span>
                                <code className="text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-zinc-700 px-2 py-1 rounded">
                                  {endpoint.path}
                                </code>
                              </div>
                              <h3 className="font-semibold text-gray-900 dark:text-gray-100">{endpoint.name}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{endpoint.description}</p>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <button
                                onClick={() => setExpandedEndpoint(expandedEndpoint === endpoint.id ? null : endpoint.id)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition-colors"
                              >
                                {expandedEndpoint === endpoint.id ? (
                                  <ChevronUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                )}
                              </button>
                              <button
                                onClick={() => testEndpoint(endpoint, endpoint.params?.[0] ? { [endpoint.params[0].name]: 'premier-league' } : undefined)}
                                disabled={loading !== null}
                                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 text-sm font-medium"
                              >
                                {loading === endpoint.id ? (
                                  <Loader className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Play className="w-4 h-4" />
                                )}
                                <span>测试</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* 展开详情 */}
                        {expandedEndpoint === endpoint.id && (
                          <div className="p-4 border-t border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900/50">
                            {/* 参数 */}
                            {endpoint.params && endpoint.params.length > 0 && (
                              <div className="mb-4">
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                                  <Code className="w-4 h-4 mr-2" />
                                  参数
                                </h4>
                                <div className="space-y-2">
                                  {endpoint.params.map(param => (
                                    <div key={param.name} className="bg-white dark:bg-zinc-800 p-3 rounded-lg">
                                      <div className="flex items-start justify-between">
                                        <div>
                                          <code className="text-sm font-mono text-primary-600 dark:text-primary-400">{param.name}</code>
                                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">({param.type})</span>
                                          {param.required && (
                                            <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-0.5 rounded ml-2">
                                              必填
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{param.description}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* 示例响应 */}
                            {endpoint.example && (
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">示例响应</h4>
                                <pre className="bg-white dark:bg-zinc-800 p-3 rounded-lg text-xs text-gray-700 dark:text-gray-300 overflow-x-auto scrollbar-thin">
{JSON.stringify(endpoint.example, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          {/* 测试结果面板 */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">测试结果</h2>

              {testResults.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8 text-sm">
                  点击"测试"按钮执行API调用
                </p>
              ) : (
                <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin">
                  {testResults.map((result, index) => (
                    <div
                      key={index}
                      className={`rounded-lg p-3 ${
                        result.success
                          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700'
                          : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700'
                      }`}
                    >
                      <div className="flex items-start space-x-2 mb-2">
                        {result.success ? (
                          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{result.endpoint}</span>
                            {result.status && (
                              <span className={`text-xs px-2 py-0.5 rounded ${
                                result.status >= 200 && result.status < 300
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                  : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                              }`}>
                                {result.status}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {result.timestamp.toLocaleTimeString('zh-CN')}
                          </p>
                        </div>
                      </div>

                      {result.data && (
                        <pre className="text-xs bg-white dark:bg-zinc-800 p-2 rounded mt-2 overflow-x-auto scrollbar-thin max-h-40 text-gray-700 dark:text-gray-300">
{JSON.stringify(result.data, null, 2)}
                        </pre>
                      )}

                      {result.error && (
                        <p className="text-xs text-red-600 dark:text-red-400 mt-2">{result.error}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {testResults.length > 0 && (
                <button
                  onClick={() => setTestResults([])}
                  className="w-full mt-4 px-4 py-2 bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm transition-colors"
                >
                  清空结果
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDocsPage;
