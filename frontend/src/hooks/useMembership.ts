import { useState, useEffect } from 'react';

const MEMBERSHIP_KEY = 'membershipStatus';

export interface MembershipStatus {
  isActive: boolean;
  plan?: 'trial' | 'monthly' | 'quarterly' | 'yearly';
  startDate?: string;
  endDate?: string;
}

export const useMembership = () => {
  const [membership, setMembership] = useState<MembershipStatus>(() => {
    const stored = localStorage.getItem(MEMBERSHIP_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return { isActive: false };
      }
    }
    return { isActive: false };
  });

  useEffect(() => {
    localStorage.setItem(MEMBERSHIP_KEY, JSON.stringify(membership));
  }, [membership]);

  const activateMembership = (plan: 'trial' | 'monthly' | 'quarterly' | 'yearly') => {
    const now = new Date();
    let endDate = new Date();

    // 计算到期时间
    switch (plan) {
      case 'trial':
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case 'monthly':
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case 'quarterly':
        endDate.setMonth(endDate.getMonth() + 3);
        break;
      case 'yearly':
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
    }

    setMembership({
      isActive: true,
      plan,
      startDate: now.toISOString(),
      endDate: endDate.toISOString(),
    });
  };

  const deactivateMembership = () => {
    setMembership({ isActive: false });
  };

  const isMember = (): boolean => {
    if (!membership.isActive) return false;

    // 检查是否过期
    if (membership.endDate) {
      const endDate = new Date(membership.endDate);
      const now = new Date();
      if (now > endDate) {
        // 自动取消过期会员
        deactivateMembership();
        return false;
      }
    }

    return true;
  };

  return {
    membership,
    isMember: isMember(),
    activateMembership,
    deactivateMembership,
  };
};
