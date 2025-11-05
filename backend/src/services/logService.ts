// 内存日志服务 - 用于在配置界面显示运行日志

export type LogLevel = 'info' | 'warn' | 'error' | 'debug' | 'success';

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  source: string;  // API调用、爬虫、同步等
  message: string;
  details?: any;   // 额外的详细信息
}

class LogService {
  private logs: LogEntry[] = [];
  private maxLogs = 500; // 最多保留500条日志
  private logId = 0;

  // 添加日志
  log(level: LogLevel, source: string, message: string, details?: any) {
    const entry: LogEntry = {
      id: `log-${++this.logId}`,
      timestamp: new Date(),
      level,
      source,
      message,
      details,
    };

    this.logs.unshift(entry); // 新日志放在前面

    // 限制日志数量
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    // 同时输出到控制台（带颜色）
    const colors = {
      info: '\x1b[36m',    // 青色
      success: '\x1b[32m', // 绿色
      warn: '\x1b[33m',    // 黄色
      error: '\x1b[31m',   // 红色
      debug: '\x1b[90m',   // 灰色
    };
    const reset = '\x1b[0m';
    const timestamp = entry.timestamp.toISOString();

    console.log(
      `${colors[level]}[${level.toUpperCase()}]${reset} ${timestamp} [${source}] ${message}`,
      details ? JSON.stringify(details, null, 2) : ''
    );
  }

  // 便捷方法
  info(source: string, message: string, details?: any) {
    this.log('info', source, message, details);
  }

  success(source: string, message: string, details?: any) {
    this.log('success', source, message, details);
  }

  warn(source: string, message: string, details?: any) {
    this.log('warn', source, message, details);
  }

  error(source: string, message: string, details?: any) {
    this.log('error', source, message, details);
  }

  debug(source: string, message: string, details?: any) {
    this.log('debug', source, message, details);
  }

  // 获取日志（支持过滤）
  getLogs(options?: {
    level?: LogLevel;
    source?: string;
    limit?: number;
    search?: string;
  }): LogEntry[] {
    let filtered = [...this.logs];

    // 按级别过滤
    if (options?.level) {
      filtered = filtered.filter(log => log.level === options.level);
    }

    // 按来源过滤
    if (options?.source) {
      filtered = filtered.filter(log => log.source.includes(options.source!));
    }

    // 搜索过滤
    if (options?.search) {
      const searchLower = options.search.toLowerCase();
      filtered = filtered.filter(log =>
        log.message.toLowerCase().includes(searchLower) ||
        log.source.toLowerCase().includes(searchLower)
      );
    }

    // 限制数量
    if (options?.limit) {
      filtered = filtered.slice(0, options.limit);
    }

    return filtered;
  }

  // 获取日志统计
  getStats() {
    const stats = {
      total: this.logs.length,
      byLevel: {} as Record<LogLevel, number>,
      bySource: {} as Record<string, number>,
      latestError: this.logs.find(log => log.level === 'error'),
      latestWarning: this.logs.find(log => log.level === 'warn'),
    };

    // 统计各级别数量
    this.logs.forEach(log => {
      stats.byLevel[log.level] = (stats.byLevel[log.level] || 0) + 1;
      stats.bySource[log.source] = (stats.bySource[log.source] || 0) + 1;
    });

    return stats;
  }

  // 清除所有日志
  clear() {
    this.logs = [];
    this.logId = 0;
    this.info('LogService', '日志已清空');
  }

  // 清除旧日志（保留最近N条）
  prune(keepCount: number = 100) {
    const removed = this.logs.length - keepCount;
    if (removed > 0) {
      this.logs = this.logs.slice(0, keepCount);
      this.info('LogService', `清理了${removed}条旧日志，保留最近${keepCount}条`);
    }
  }
}

// 导出单例
export const logService = new LogService();
