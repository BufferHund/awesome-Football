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

// 通用API请求处理函数
async function handleApiRequest(url: string, options?: RequestInit) {
  try {
    const response = await fetch(url, options);

    // 检查响应状态
    if (!response.ok) {
      // 尝试获取错误消息
      let errorMessage = `HTTP错误: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // 如果无法解析JSON，使用默认错误消息
      }
      throw new Error(errorMessage);
    }

    // 检查响应是否为空
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('后端服务未正常响应。请确保后端服务已启动 (端口3000)');
    }

    const text = await response.text();
    if (!text) {
      throw new Error('后端返回空响应。请检查后端服务是否正常运行');
    }

    return JSON.parse(text);
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('无法连接到后端服务。请确保后端服务已启动 (localhost:3000)');
    }
    throw error;
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
