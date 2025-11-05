import { useState, useEffect } from 'react';
import { useMembership } from './useMembership';

const MATERIAL_DESIGN_3_KEY = 'materialDesign3Enabled';

export const useMaterialDesign3 = () => {
  const { isMember } = useMembership();
  const [isEnabled, setIsEnabled] = useState(() => {
    const stored = localStorage.getItem(MATERIAL_DESIGN_3_KEY);
    return stored === 'true';
  });

  // 会员验证：如果不是会员，自动禁用
  useEffect(() => {
    if (!isMember && isEnabled) {
      setIsEnabled(false);
    }
  }, [isMember]);

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
    if (!isMember) {
      alert('Material Design 3效果是会员专属特权\n\n请前往会员页面开通会员以解锁此功能！');
      return;
    }
    setIsEnabled(prev => !prev);
  };

  const enable = () => {
    if (!isMember) {
      alert('Material Design 3效果是会员专属特权\n\n请前往会员页面开通会员以解锁此功能！');
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
