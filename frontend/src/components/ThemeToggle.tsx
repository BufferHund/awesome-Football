import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
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
  ];

  return (
    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-900 p-1">
      {themes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => handleThemeChange(value)}
          title={label}
          className={`
            p-2 transition-colors
            ${theme === value
              ? 'bg-gray-900 dark:bg-white text-white dark:text-black'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
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
