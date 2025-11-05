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

// 手动同步服务
export const syncTriggerService = {
  // 同步今日比赛
  async syncTodayMatches() {
    const response = await fetch('/api/sync/matches/today', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': configService.getApiKey(),
      },
    });
    return response.json();
  },

  // 同步直播比赛
  async syncLiveMatches() {
    const response = await fetch('/api/sync/matches/live', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': configService.getApiKey(),
      },
    });
    return response.json();
  },

  // 同步积分榜
  async syncStandings(league: string) {
    const response = await fetch(`/api/sync/standings/${league}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': configService.getApiKey(),
      },
    });
    return response.json();
  },

  // Google 爬虫
  async scrapeGoogle(query: string = 'football scores today') {
    const response = await fetch(`/api/sync/scrape/google?q=${encodeURIComponent(query)}`);
    return response.json();
  },

  // FlashScore 爬虫
  async scrapeFlashScore() {
    const response = await fetch('/api/sync/scrape/flashscore');
    return response.json();
  },

  // ESPN 爬虫
  async scrapeESPN() {
    const response = await fetch('/api/sync/scrape/espn');
    return response.json();
  },
};
