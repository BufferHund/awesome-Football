// 前端日志API服务

export type LogLevel = 'info' | 'warn' | 'error' | 'debug' | 'success';

export interface BackendLogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  source: string;
  message: string;
  details?: any;
}

export interface LogStats {
  total: number;
  byLevel: Record<LogLevel, number>;
  bySource: Record<string, number>;
  latestError?: BackendLogEntry;
  latestWarning?: BackendLogEntry;
}

class LogsAPI {
  private baseUrl = '/api/logs';

  // 获取日志列表
  async getLogs(options?: {
    level?: LogLevel;
    source?: string;
    limit?: number;
    search?: string;
  }): Promise<{ success: boolean; logs: BackendLogEntry[]; count: number }> {
    const params = new URLSearchParams();
    if (options?.level) params.append('level', options.level);
    if (options?.source) params.append('source', options.source);
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.search) params.append('search', options.search);

    const url = `${this.baseUrl}${params.toString() ? '?' + params.toString() : ''}`;
    const response = await fetch(url);
    return response.json();
  }

  // 获取日志统计
  async getStats(): Promise<{ success: boolean; stats: LogStats }> {
    const response = await fetch(`${this.baseUrl}/stats`);
    return response.json();
  }

  // 清空日志
  async clearLogs(): Promise<{ success: boolean; message: string }> {
    const response = await fetch(this.baseUrl, { method: 'DELETE' });
    return response.json();
  }

  // 清理旧日志
  async pruneLogs(keepCount: number = 100): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${this.baseUrl}/prune`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keepCount }),
    });
    return response.json();
  }
}

export const logsAPI = new LogsAPI();
