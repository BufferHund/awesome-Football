import { useState, useEffect } from 'react';

const LIQUID_GLASS_KEY = 'liquidGlassEnabled';

export const useLiquidGlass = () => {
  const [isEnabled, setIsEnabled] = useState(() => {
    const stored = localStorage.getItem(LIQUID_GLASS_KEY);
    return stored === 'true';
  });

  useEffect(() => {
    localStorage.setItem(LIQUID_GLASS_KEY, String(isEnabled));

    // 添加或移除body类名
    if (isEnabled) {
      document.body.classList.add('liquid-glass-mode');
    } else {
      document.body.classList.remove('liquid-glass-mode');
    }
  }, [isEnabled]);

  const toggle = () => {
    setIsEnabled(prev => !prev);
  };

  const enable = () => {
    setIsEnabled(true);
  };

  const disable = () => {
    setIsEnabled(false);
  };

  return {
    isEnabled,
    toggle,
    enable,
    disable,
  };
};
