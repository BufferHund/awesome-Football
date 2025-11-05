import { useState, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { themeService, Theme } from '../services/theme';

const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>(themeService.getTheme());

  useEffect(() => {
    themeService.initTheme();
  }, []);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    themeService.setTheme(newTheme);
  };

  const themes: { value: Theme; icon: any; label: string }[] = [
    { value: 'light', icon: Sun, label: '浅色' },
    { value: 'dark', icon: Moon, label: '深色' },
    { value: 'system', icon: Monitor, label: '跟随系统' },
  ];

  return (
    <div className="glass-card p-1 flex items-center space-x-1 rounded-full">
      {themes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => handleThemeChange(value)}
          title={label}
          className={`
            relative p-2 rounded-full transition-all duration-300
            ${theme === value
              ? 'bg-primary-500 text-white shadow-lg scale-110'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-200'
            }
          `}
        >
          <Icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
};

export default ThemeToggle;
