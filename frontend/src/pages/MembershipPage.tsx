import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMembership } from '../hooks/useMembership';
import { useAuth } from '../contexts/AuthContext';
import {
  Crown,
  Zap,
  Star,
  ShoppingBag,
  Users,
  TrendingUp,
  Shield,
  Gift,
  Check,
  Sparkles,
  Bot,
  BarChart3,
  X as XIcon,
  Layers,
} from 'lucide-react';

type PlanType = 'trial' | 'monthly' | 'quarterly' | 'yearly';

interface Plan {
  id: PlanType;
  name: string;
  price: number;
  originalPrice?: number;
  duration: string;
  badge?: string;
  badgeColor?: string;
  popular?: boolean;
  savings?: string;
}

const MembershipPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { activateMembership } = useMembership();
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('yearly');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const plans: Plan[] = [
    {
      id: 'trial',
      name: '免费试用',
      price: 0,
      duration: '1个月',
      badge: '体验所有功能',
      badgeColor: 'bg-green-500',
    },
    {
      id: 'monthly',
      name: '月度会员',
      price: 29.9,
      duration: '每月',
    },
    {
      id: 'quarterly',
      name: '季度会员',
      price: 79.9,
      originalPrice: 89.7,
      duration: '3个月',
      savings: '省10元',
      badge: '性价比之选',
      badgeColor: 'bg-blue-500',
    },
    {
      id: 'yearly',
      name: '年度会员',
      price: 268,
      originalPrice: 358.8,
      duration: '12个月',
      savings: '省90元',
      badge: '最超值',
      badgeColor: 'bg-purple-500',
      popular: true,
    },
  ];

  const features = [
    {
      icon: XIcon,
      title: '去除广告',
      description: '畅享纯净观赛体验，无任何广告打扰',
      color: 'text-red-500',
      bgColor: 'bg-red-100 dark:bg-red-900/20',
    },
    {
      icon: BarChart3,
      title: '详细球员分析',
      description: '解锁所有球员深度数据、热力图、传球网络图',
      color: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      icon: Bot,
      title: '观赛规划智能体',
      description: 'AI助手为您推荐精彩比赛，个性化观赛计划',
      color: 'text-purple-500',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      icon: ShoppingBag,
      title: '95折购物特权',
      description: '球迷商城所有商品享受95折优惠',
      color: 'text-orange-500',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    },
    {
      icon: Zap,
      title: '实时比分推送',
      description: '最快的比分更新，关键时刻不错过',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
    },
    {
      icon: TrendingUp,
      title: '专家预测分析',
      description: '资深足球分析师的赛前预测和战术解读',
      color: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      icon: Users,
      title: '会员专属社区',
      description: '加入高端球迷圈，与大神交流心得',
      color: 'text-teal-500',
      bgColor: 'bg-teal-100 dark:bg-teal-900/20',
    },
    {
      icon: Shield,
      title: '优先客服支持',
      description: '7×24小时专属客服，问题优先处理',
      color: 'text-pink-500',
      bgColor: 'bg-pink-100 dark:bg-pink-900/20',
    },
    {
      icon: Gift,
      title: '会员专属福利',
      description: '定期福利活动、抽奖、线下观赛名额',
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-100 dark:bg-cyan-900/20',
    },
  ];

  const handlePurchase = () => {
    // 检查是否已登录
    if (!isAuthenticated) {
      alert('请先登录才能购买会员');
      navigate('/login');
      return;
    }

    // 检查邮箱是否已验证
    if (!user?.emailVerified) {
      alert('请先验证邮箱才能购买会员。您可以在个人中心验证邮箱。');
      navigate('/profile');
      return;
    }

    setShowPaymentModal(true);
  };

  const handleStartTrial = () => {
    // 检查是否已登录
    if (!isAuthenticated) {
      alert('请先登录才能开通试用');
      navigate('/login');
      return;
    }

    // 检查邮箱是否已验证
    if (!user?.emailVerified) {
      alert('请先验证邮箱才能开通试用。您可以在个人中心验证邮箱。');
      navigate('/profile');
      return;
    }

    // 激活试用会员
    activateMembership('trial');
    alert('恭喜！您已成功开通1个月免费试用\n\n所有会员功能已解锁，尽情享受吧！');
    navigate('/');
  };

  const handleConfirmPayment = (plan: PlanType) => {
    // 模拟支付成功，激活会员
    activateMembership(plan);
    setShowPaymentModal(false);
    alert('支付成功！会员已开通\n\n感谢您的支持，所有会员功能已解锁！');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 dark:bg-white mb-6 rounded-2xl">
            <Crown className="w-8 h-8 text-white dark:text-black" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Premium
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            解锁全部高级功能，专业足球观赛体验
          </p>
        </div>

        {/* 试用横幅 */}
        <div className="mb-12">
          <div className="bg-gray-900 dark:bg-white p-8 border border-gray-900 dark:border-white rounded-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-white dark:text-black">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-xs font-medium uppercase tracking-wider">限时福利</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  免费试用1个月
                </h2>
                <p className="text-gray-300 dark:text-gray-700">
                  体验所有功能，无需绑卡，随时取消
                </p>
              </div>
              <button
                onClick={handleStartTrial}
                className="px-6 py-3 bg-white dark:bg-black text-black dark:text-white font-medium hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors whitespace-nowrap rounded-lg"
              >
                立即试用
              </button>
            </div>
          </div>
        </div>

        {/* 套餐选择 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            选择套餐
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`cursor-pointer border p-6 transition-colors rounded-2xl ${
                  selectedPlan === plan.id
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-black border-gray-900 dark:border-white'
                    : 'border-gray-200 dark:border-gray-800 hover:border-gray-900 dark:hover:border-white'
                }`}
              >
                {/* 热门标签 */}
                {plan.popular && (
                  <div className="text-xs font-medium mb-3 text-gray-900 dark:text-white">
                    推荐
                  </div>
                )}

                {/* 徽章 */}
                {plan.badge && !plan.popular && (
                  <div className="text-xs mb-3 text-gray-500 dark:text-gray-400">
                    {plan.badge}
                  </div>
                )}

                {/* 套餐名称 */}
                <h3 className={`text-xl font-bold mb-4 ${selectedPlan === plan.id ? 'text-white dark:text-black' : 'text-gray-900 dark:text-white'}`}>
                  {plan.name}
                </h3>

                {/* 价格 */}
                <div className="mb-4">
                  {plan.originalPrice && (
                    <div className={`text-xs line-through ${selectedPlan === plan.id ? 'text-gray-400 dark:text-gray-600' : 'text-gray-400'}`}>
                      ¥{plan.originalPrice}
                    </div>
                  )}
                  <div className="flex items-baseline gap-1">
                    <span className={`text-3xl font-bold ${selectedPlan === plan.id ? 'text-white dark:text-black' : 'text-gray-900 dark:text-white'}`}>
                      {plan.price === 0 ? '免费' : `¥${plan.price}`}
                    </span>
                    {plan.price > 0 && (
                      <span className={`text-xs ${selectedPlan === plan.id ? 'text-gray-400 dark:text-gray-600' : 'text-gray-500'}`}>
                        /{plan.duration}
                      </span>
                    )}
                  </div>
                  {plan.savings && (
                    <div className={`text-xs mt-1 ${selectedPlan === plan.id ? 'text-gray-400 dark:text-gray-600' : 'text-gray-600 dark:text-gray-400'}`}>
                      {plan.savings}
                    </div>
                  )}
                </div>

                {/* 选中指示器 */}
                {selectedPlan === plan.id && (
                  <div className={`flex items-center gap-2 font-medium text-sm ${selectedPlan === plan.id ? 'text-white dark:text-black' : ''}`}>
                    <Check className="w-4 h-4" />
                    <span>已选择</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Premium 权益 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-900 dark:text-white">
            Premium 权益
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
            一次订阅，解锁全部功能
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="border border-gray-200 dark:border-gray-800 p-6 hover:border-gray-900 dark:hover:border-white transition-colors rounded-2xl"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 ${feature.bgColor} mb-4 rounded-xl`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 购买按钮 */}
        <div className="text-center">
          <button
            onClick={handlePurchase}
            disabled={selectedPlan === 'trial'}
            className={`px-8 py-3 font-medium transition-colors rounded-lg ${
              selectedPlan === 'trial'
                ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                : 'bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-700 dark:hover:bg-gray-200'
            }`}
          >
            {selectedPlan === 'trial' ? '请选择付费套餐' : '立即购买'}
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            支付宝 · 微信支付 · 银联卡
          </p>
        </div>

        {/* 用户评价 */}
        <div className="mt-16 border-t border-gray-200 dark:border-gray-800 pt-12">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            用户评价
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                name: '张三',
                comment: '球员分析功能强大，数据可视化专业',
              },
              {
                name: '李四',
                comment: '观赛规划智能体帮我找到精彩比赛',
              },
              {
                name: '王五',
                comment: '去广告后体验提升，95折购物实惠',
              },
            ].map((review, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-800 p-6 rounded-2xl">
                <div className="font-medium text-gray-900 dark:text-white mb-2">{review.name}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 支付弹窗 */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-black border border-gray-900 dark:border-white p-8 max-w-md w-full rounded-2xl">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-900 dark:bg-white mb-4 rounded-xl">
                <Crown className="w-6 h-6 text-white dark:text-black" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                确认购买
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {plans.find(p => p.id === selectedPlan)?.name}
              </p>
            </div>

            <div className="border border-gray-200 dark:border-gray-800 p-4 mb-6 rounded-xl">
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-gray-600 dark:text-gray-400">套餐价格</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ¥{plans.find(p => p.id === selectedPlan)?.price}
                </span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-gray-900 dark:text-white">应付金额</span>
                <span className="text-gray-900 dark:text-white">
                  ¥{plans.find(p => p.id === selectedPlan)?.price}
                </span>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <button
                onClick={() => handleConfirmPayment(selectedPlan)}
                className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-black font-medium hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors rounded-lg"
              >
                支付宝支付
              </button>
              <button
                onClick={() => handleConfirmPayment(selectedPlan)}
                className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-black font-medium hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors rounded-lg"
              >
                微信支付
              </button>
              <button
                onClick={() => handleConfirmPayment(selectedPlan)}
                className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-black font-medium hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors rounded-lg"
              >
                银联卡支付
              </button>
            </div>

            <button
              onClick={() => setShowPaymentModal(false)}
              className="w-full py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:border-gray-900 dark:hover:border-white transition-colors rounded-lg"
            >
              取消
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembershipPage;
