import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMembership } from '../hooks/useMembership';
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
      icon: Sparkles,
      title: 'iOS 16 LiquidGlass效果',
      description: '严格遵循Apple官方设计规范，使用Framer Motion动画库',
      color: 'text-cyan-500',
      bgColor: 'bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/20 dark:to-blue-900/20',
      isFree: true,
    },
    {
      icon: Layers,
      title: 'Material Design 3效果',
      description: '严格遵循Google官方规范，使用MUI v5组件库',
      color: 'text-indigo-500',
      bgColor: 'bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20',
      isFree: true,
    },
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
    setShowPaymentModal(true);
  };

  const handleStartTrial = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-emerald-50 dark:from-gray-900 dark:via-green-900/20 dark:to-emerald-900/20 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-6 shadow-lg">
            <Crown className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            懂球帝 Pro 会员
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            解锁全部高级功能，开启专业足球观赛体验
          </p>
        </div>

        {/* 试用横幅 */}
        <div className="mb-12 relative overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 shadow-xl relative">
            {/* 装饰背景 */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-6 h-6" />
                  <span className="text-sm font-semibold uppercase tracking-wider">限时福利</span>
                </div>
                <h2 className="text-3xl font-bold mb-2">
                  免费试用1个月
                </h2>
                <p className="text-green-100 text-lg">
                  体验所有Pro功能，无需绑卡，随时取消
                </p>
              </div>
              <button
                onClick={handleStartTrial}
                className="px-8 py-4 bg-white text-green-600 rounded-full font-bold text-lg hover:bg-gray-100 transition-all hover:scale-105 shadow-lg whitespace-nowrap"
              >
                立即免费试用
              </button>
            </div>
          </div>
        </div>

        {/* 套餐选择 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">
            选择适合您的套餐
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative cursor-pointer rounded-2xl p-6 transition-all ${
                  selectedPlan === plan.id
                    ? 'bg-gradient-to-br from-green-600 to-emerald-600 text-white shadow-2xl scale-105'
                    : 'bg-white dark:bg-gray-800 hover:shadow-xl'
                } ${plan.popular ? 'ring-4 ring-green-500 ring-opacity-50' : ''}`}
              >
                {/* 热门标签 */}
                {plan.popular && (
                  <div className="absolute -top-3 -right-3">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      🔥 最热门
                    </div>
                  </div>
                )}

                {/* 徽章 */}
                {plan.badge && (
                  <div className={`inline-block ${plan.badgeColor || 'bg-gray-500'} text-white text-xs font-semibold px-3 py-1 rounded-full mb-4`}>
                    {plan.badge}
                  </div>
                )}

                {/* 套餐名称 */}
                <h3 className={`text-2xl font-bold mb-2 ${selectedPlan === plan.id ? 'text-white' : 'text-gray-800 dark:text-gray-100'}`}>
                  {plan.name}
                </h3>

                {/* 价格 */}
                <div className="mb-4">
                  {plan.originalPrice && (
                    <div className={`text-sm line-through ${selectedPlan === plan.id ? 'text-green-200' : 'text-gray-400'}`}>
                      ¥{plan.originalPrice}
                    </div>
                  )}
                  <div className="flex items-baseline gap-1">
                    <span className={`text-4xl font-bold ${selectedPlan === plan.id ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      {plan.price === 0 ? '免费' : `¥${plan.price}`}
                    </span>
                    {plan.price > 0 && (
                      <span className={`text-sm ${selectedPlan === plan.id ? 'text-green-200' : 'text-gray-500'}`}>
                        /{plan.duration}
                      </span>
                    )}
                  </div>
                  {plan.savings && (
                    <div className={`text-sm font-semibold mt-1 ${selectedPlan === plan.id ? 'text-yellow-300' : 'text-green-600'}`}>
                      {plan.savings}
                    </div>
                  )}
                </div>

                {/* 选中指示器 */}
                {selectedPlan === plan.id && (
                  <div className="flex items-center gap-2 text-white font-semibold">
                    <Check className="w-5 h-5" />
                    <span>已选择</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 会员特权 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-800 dark:text-gray-100">
            会员专享特权
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
            一次订阅，解锁全部高级功能
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`bg-white dark:bg-gray-800 rounded-xl p-6 hover:shadow-xl transition-all hover:-translate-y-1 relative ${
                  (feature as any).isFree ? 'ring-2 ring-orange-500 ring-opacity-50' : ''
                }`}
              >
                {/* 限免标签 */}
                {(feature as any).isFree && (
                  <div className="absolute -top-2 -right-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-red-500 to-orange-500 shadow-lg animate-pulse-soft">
                      🎉 限时免费
                    </div>
                  </div>
                )}
                <div className={`inline-flex items-center justify-center w-14 h-14 ${feature.bgColor} rounded-xl mb-4`}>
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100 flex items-center gap-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
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
            className={`px-12 py-5 rounded-full font-bold text-xl transition-all shadow-xl ${
              selectedPlan === 'trial'
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 hover:scale-105'
            }`}
          >
            {selectedPlan === 'trial' ? '请选择付费套餐' : '立即购买'}
          </button>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            支持支付宝、微信支付、银联卡 · 安全加密 · 随时取消
          </p>
        </div>

        {/* 用户评价 */}
        <div className="mt-16 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">
            用户真实评价
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: '张三',
                avatar: '👨',
                comment: '球员分析功能太强大了，数据可视化做得非常专业！',
                rating: 5,
              },
              {
                name: '李四',
                avatar: '👩',
                comment: '观赛规划智能体帮我找到了好多精彩比赛，再也不会错过了。',
                rating: 5,
              },
              {
                name: '王五',
                avatar: '🧑',
                comment: '去广告后体验提升太多，95折购物也很实惠，值得订阅！',
                rating: 5,
              },
            ].map((review, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-3xl">{review.avatar}</div>
                  <div>
                    <div className="font-semibold text-gray-800 dark:text-gray-100">{review.name}</div>
                    <div className="flex gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 支付弹窗 */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                <Crown className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">
                确认购买
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {plans.find(p => p.id === selectedPlan)?.name}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400">套餐价格</span>
                <span className="font-semibold text-gray-800 dark:text-gray-100">
                  ¥{plans.find(p => p.id === selectedPlan)?.price}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span className="text-gray-800 dark:text-gray-100">应付金额</span>
                <span className="text-green-600">
                  ¥{plans.find(p => p.id === selectedPlan)?.price}
                </span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleConfirmPayment(selectedPlan)}
                className="w-full py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
              >
                支付宝支付
              </button>
              <button
                onClick={() => handleConfirmPayment(selectedPlan)}
                className="w-full py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors"
              >
                微信支付
              </button>
              <button
                onClick={() => handleConfirmPayment(selectedPlan)}
                className="w-full py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-colors"
              >
                银联卡支付
              </button>
            </div>

            <button
              onClick={() => setShowPaymentModal(false)}
              className="w-full py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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
