// 主题管理服务
export type Theme = 'light' | 'dark' | 'system';

const THEME_KEY = 'football-app-theme';

export const themeService = {
  // 获取当前主题
  getTheme(): Theme {
    const stored = localStorage.getItem(THEME_KEY) as Theme;
    return stored || 'system';
  },

  // 设置主题
  setTheme(theme: Theme): void {
    localStorage.setItem(THEME_KEY, theme);
    this.applyTheme(theme);
  },

  // 应用主题到 DOM
  applyTheme(theme: Theme): void {
    const root = document.documentElement;

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.toggle('dark', systemTheme === 'dark');
    } else {
      root.classList.toggle('dark', theme === 'dark');
    }
  },

  // 初始化主题
  initTheme(): void {
    const theme = this.getTheme();
    this.applyTheme(theme);

    // 监听系统主题变化
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (this.getTheme() === 'system') {
        document.documentElement.classList.toggle('dark', e.matches);
      }
    });
  },

  // 切换主题
  toggleTheme(): void {
    const current = this.getTheme();
    const next = current === 'light' ? 'dark' : current === 'dark' ? 'system' : 'light';
    this.setTheme(next);
  },
};
