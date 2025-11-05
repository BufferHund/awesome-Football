import { useState, useEffect } from 'react';
import { logsAPI, BackendLogEntry, LogLevel } from '../services/logs';
import {
  Terminal,
  RefreshCw,
  Filter,
  Search,
  Trash2,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Loader,
  Bug
} from 'lucide-react';

const BackendLogViewer = () => {
  const [logs, setLogs] = useState<BackendLogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterLevel, setFilterLevel] = useState<LogLevel | ''>('');
  const [filterSource, setFilterSource] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());

  // 加载日志
  const loadLogs = async () => {
    setLoading(true);
    try {
      const response = await logsAPI.getLogs({
        level: filterLevel || undefined,
        source: filterSource || undefined,
        search: searchQuery || undefined,
        limit: 100,
      });
      if (response.success) {
        setLogs(response.logs);
      }
    } catch (error) {
      console.error('加载日志失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 清空日志
  const handleClearLogs = async () => {
    if (!confirm('确定要清空所有后端日志吗？')) return;
    try {
      await logsAPI.clearLogs();
      await loadLogs();
    } catch (error) {
      console.error('清空日志失败:', error);
    }
  };

  // 切换展开/折叠
  const toggleExpand = (logId: string) => {
    setExpandedLogs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(logId)) {
        newSet.delete(logId);
      } else {
        newSet.add(logId);
      }
      return newSet;
    });
  };

  // 获取级别图标和颜色
  const getLevelIcon = (level: LogLevel) => {
    switch (level) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500 dark:text-red-400" />;
      case 'warn':
        return <AlertTriangle className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-500 dark:text-blue-400" />;
      case 'debug':
        return <Bug className="w-4 h-4 text-gray-500 dark:text-gray-400" />;
    }
  };

  const getLevelColor = (level: LogLevel) => {
    switch (level) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700';
      case 'warn':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700';
      case 'debug':
        return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700';
    }
  };

  // 初始加载
  useEffect(() => {
    loadLogs();
  }, [filterLevel, filterSource, searchQuery]);

  // 自动刷新
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(loadLogs, 3000); // 每3秒刷新
    return () => clearInterval(interval);
  }, [autoRefresh, filterLevel, filterSource, searchQuery]);

  return (
    <section className="glass-card p-6 animate-slide-up">
      {/* 标题 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Terminal className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">后端运行日志</h2>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            ({logs.length} 条)
          </span>
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center space-x-2">
          {/* 自动刷新 */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`p-2 rounded-lg transition-colors ${
              autoRefresh
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                : 'bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-gray-400'
            }`}
            title={autoRefresh ? '停止自动刷新' : '开启自动刷新（每3秒）'}
          >
            <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
          </button>

          {/* 手动刷新 */}
          <button
            onClick={loadLogs}
            disabled={loading}
            className="p-2 bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-600 transition-colors disabled:opacity-50"
            title="刷新日志"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {/* 清空日志 */}
          <button
            onClick={handleClearLogs}
            className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
            title="清空所有日志"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 过滤器 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        {/* 级别过滤 */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            <Filter className="w-3 h-3 inline mr-1" />
            日志级别
          </label>
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value as LogLevel | '')}
            className="input text-sm py-2"
          >
            <option value="">全部</option>
            <option value="success">成功</option>
            <option value="info">信息</option>
            <option value="warn">警告</option>
            <option value="error">错误</option>
            <option value="debug">调试</option>
          </select>
        </div>

        {/* 来源过滤 */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            <Filter className="w-3 h-3 inline mr-1" />
            来源
          </label>
          <input
            type="text"
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            placeholder="例如: Sync, Scraper"
            className="input text-sm py-2"
          />
        </div>

        {/* 搜索 */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            <Search className="w-3 h-3 inline mr-1" />
            搜索
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索消息内容"
            className="input text-sm py-2"
          />
        </div>
      </div>

      {/* 日志列表 */}
      <div className="space-y-2 max-h-[600px] overflow-y-auto scrollbar-thin">
        {logs.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            {loading ? (
              <Loader className="w-6 h-6 animate-spin mx-auto mb-2" />
            ) : (
              <Terminal className="w-12 h-12 mx-auto mb-2 opacity-50" />
            )}
            <p>{loading ? '加载中...' : '暂无日志记录'}</p>
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className={`p-3 rounded-xl border ${getLevelColor(log.level)}`}
            >
              {/* 主要信息 */}
              <div className="flex items-start space-x-2">
                {getLevelIcon(log.level)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono bg-white dark:bg-zinc-800 px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">
                        {log.source}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(log.timestamp).toLocaleString('zh-CN')}
                      </span>
                    </div>
                    {log.details && (
                      <button
                        onClick={() => toggleExpand(log.id)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                      >
                        {expandedLogs.has(log.id) ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-200">{log.message}</p>
                </div>
              </div>

              {/* 详细信息（可展开） */}
              {expandedLogs.has(log.id) && log.details && (
                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700/50">
                  <pre className="text-xs bg-white dark:bg-zinc-800 p-2 rounded overflow-x-auto scrollbar-thin text-gray-600 dark:text-gray-400">
                    {JSON.stringify(log.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default BackendLogViewer;
