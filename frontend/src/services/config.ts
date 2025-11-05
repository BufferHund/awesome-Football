// 配置管理服务
interface AppConfig {
  apiKey: string;
  enableAutoSync: boolean;
  apiBaseUrl: string;
  syncInterval: number; // 分钟
}

const CONFIG_KEY = 'football-app-config';

const defaultConfig: AppConfig = {
  apiKey: '',
  enableAutoSync: false,
  apiBaseUrl: '/api',
  syncInterval: 5,
};

export const configService = {
  // 获取配置
  getConfig(): AppConfig {
    try {
      const stored = localStorage.getItem(CONFIG_KEY);
      if (stored) {
        return { ...defaultConfig, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Failed to load config:', error);
    }
    return defaultConfig;
  },

  // 保存配置
  saveConfig(config: Partial<AppConfig>): void {
    try {
      const current = this.getConfig();
      const updated = { ...current, ...config };
      localStorage.setItem(CONFIG_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save config:', error);
    }
  },

  // 获取 API Key
  getApiKey(): string {
    return this.getConfig().apiKey;
  },

  // 设置 API Key
  setApiKey(apiKey: string): void {
    this.saveConfig({ apiKey });
  },

  // 清除所有配置
  clearConfig(): void {
    localStorage.removeItem(CONFIG_KEY);
  },
};

// 同步结果接口
export interface DetailedSyncResult {
  success: boolean;
  message: string;
  statusCode?: number;
  apiKey?: string;
  endpoint?: string;
  requestTime?: string;
  responseTime?: string;
  errorDetails?: any;
  rawResponse?: any;
}

// 通用API请求处理函数
async function handleApiRequest(url: string, options?: RequestInit): Promise<DetailedSyncResult> {
  const requestTime = new Date().toISOString();
  const apiKey = configService.getApiKey();

  try {
    const response = await fetch(url, options);
    const responseTime = new Date().toISOString();

    // 检查响应状态
    if (!response.ok) {
      // 尝试获取错误消息
      let errorMessage = `HTTP错误: ${response.status} ${response.statusText}`;
      let errorDetails = null;

      try {
        errorDetails = await response.json();
        errorMessage = errorDetails.message || errorDetails.error || errorMessage;
      } catch {
        // 如果无法解析JSON，使用默认错误消息
      }

      return {
        success: false,
        message: errorMessage,
        statusCode: response.status,
        apiKey: apiKey ? `${apiKey.substring(0, 8)}...` : '未设置',
        endpoint: url,
        requestTime,
        responseTime,
        errorDetails
      };
    }

    // 检查响应是否为空
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return {
        success: false,
        message: '后端服务未正常响应。请确保后端服务已启动 (端口3000)',
        statusCode: response.status,
        endpoint: url,
        requestTime,
        responseTime,
        errorDetails: { contentType }
      };
    }

    const text = await response.text();
    if (!text) {
      return {
        success: false,
        message: '后端返回空响应。请检查后端服务是否正常运行',
        statusCode: response.status,
        endpoint: url,
        requestTime,
        responseTime
      };
    }

    const data = JSON.parse(text);
    return {
      success: data.success !== false,
      message: data.message || '操作成功',
      statusCode: response.status,
      endpoint: url,
      requestTime,
      responseTime,
      rawResponse: data
    };
  } catch (error) {
    const responseTime = new Date().toISOString();

    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        success: false,
        message: '无法连接到后端服务。请确保后端服务已启动 (localhost:3000)',
        endpoint: url,
        requestTime,
        responseTime,
        errorDetails: {
          errorType: 'NetworkError',
          errorMessage: error.message,
          stack: error.stack
        }
      };
    }

    return {
      success: false,
      message: (error as Error).message || '未知错误',
      endpoint: url,
      requestTime,
      responseTime,
      errorDetails: {
        errorType: error?.constructor?.name || 'Error',
        errorMessage: (error as Error).message,
        stack: (error as Error).stack
      }
    };
  }
}

// 手动同步服务
export const syncTriggerService = {
  // 同步今日比赛
  async syncTodayMatches() {
    return handleApiRequest('/api/sync/matches/today', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': configService.getApiKey(),
      },
    });
  },

  // 同步直播比赛
  async syncLiveMatches() {
    return handleApiRequest('/api/sync/matches/live', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': configService.getApiKey(),
      },
    });
  },

  // 同步积分榜
  async syncStandings(league: string) {
    return handleApiRequest(`/api/sync/standings/${league}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': configService.getApiKey(),
      },
    });
  },

  // Google 爬虫
  async scrapeGoogle(query: string = 'football scores today') {
    return handleApiRequest(`/api/sync/scrape/google?q=${encodeURIComponent(query)}`);
  },

  // FlashScore 爬虫
  async scrapeFlashScore() {
    return handleApiRequest('/api/sync/scrape/flashscore');
  },

  // ESPN 爬虫
  async scrapeESPN() {
    return handleApiRequest('/api/sync/scrape/espn');
  },
};
