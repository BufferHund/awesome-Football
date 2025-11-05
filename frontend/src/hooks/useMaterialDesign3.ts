import { useState, useEffect } from 'react';

const MATERIAL_DESIGN_3_KEY = 'materialDesign3Enabled';

export const useMaterialDesign3 = () => {
  const [isEnabled, setIsEnabled] = useState(() => {
    const stored = localStorage.getItem(MATERIAL_DESIGN_3_KEY);
    return stored === 'true';
  });

  useEffect(() => {
    localStorage.setItem(MATERIAL_DESIGN_3_KEY, String(isEnabled));

    // 添加或移除body类名
    if (isEnabled) {
      document.body.classList.add('material-design-3-mode');
    } else {
      document.body.classList.remove('material-design-3-mode');
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
