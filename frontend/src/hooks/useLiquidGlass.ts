import { useState, useEffect } from 'react';
import { useMembership } from './useMembership';

const LIQUID_GLASS_KEY = 'liquidGlassEnabled';

export const useLiquidGlass = () => {
  const { isMember } = useMembership();
  const [isEnabled, setIsEnabled] = useState(() => {
    const stored = localStorage.getItem(LIQUID_GLASS_KEY);
    return stored === 'true';
  });

  // 会员验证：如果不是会员，自动禁用
  useEffect(() => {
    if (!isMember && isEnabled) {
      setIsEnabled(false);
    }
  }, [isMember]);

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
    if (!isMember) {
      alert('LiquidGlass效果是会员专属特权\n\n请前往会员页面开通会员以解锁此功能！');
      return;
    }
    setIsEnabled(prev => !prev);
  };

  const enable = () => {
    if (!isMember) {
      alert('LiquidGlass效果是会员专属特权\n\n请前往会员页面开通会员以解锁此功能！');
      return;
    }
    setIsEnabled(true);
  };

  const disable = () => {
    setIsEnabled(false);
  };

  return {
    isEnabled: isEnabled && isMember, // 只有会员且启用时才返回true
    toggle,
    enable,
    disable,
    isMember, // 暴露会员状态供UI使用
  };
};
