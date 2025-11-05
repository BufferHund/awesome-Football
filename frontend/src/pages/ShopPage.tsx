import { useState } from 'react';
import { ShoppingBag, Search, ExternalLink, Crown, Shirt, Ticket, Tv, Gift, TrendingUp, Filter } from 'lucide-react';

type ProductCategory = 'all' | 'jersey' | 'membership' | 'ticket' | 'merchandise';

interface Product {
  id: number;
  name: string;
  category: ProductCategory;
  price: number;
  memberPrice: number;
  image: string;
  description: string;
  badge?: string;
  badgeColor?: string;
  link: string;
  platform: string;
  hot?: boolean;
}

const ShopPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all' as ProductCategory, name: '全部', icon: ShoppingBag },
    { id: 'jersey' as ProductCategory, name: '球衣', icon: Shirt },
    { id: 'membership' as ProductCategory, name: '直播会员', icon: Tv },
    { id: 'ticket' as ProductCategory, name: '门票', icon: Ticket },
    { id: 'merchandise' as ProductCategory, name: '周边', icon: Gift },
  ];

  const products: Product[] = [
    // 球衣类
    {
      id: 1,
      name: '曼联2024-25赛季主场球衣',
      category: 'jersey',
      price: 699,
      memberPrice: 664,
      image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=500',
      description: '正品授权，全新赛季主场球衣，含球员印字',
      badge: '🔥 热销',
      badgeColor: 'bg-red-500',
      link: 'https://www.nike.com',
      platform: 'Nike官方商城',
      hot: true,
    },
    {
      id: 2,
      name: '皇马2024-25赛季主场球衣',
      category: 'jersey',
      price: 799,
      memberPrice: 759,
      image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500',
      description: '正品授权，传奇白衣战袍',
      badge: '⭐ 推荐',
      badgeColor: 'bg-yellow-500',
      link: 'https://www.adidas.com',
      platform: 'Adidas官方商城',
      hot: true,
    },
    {
      id: 3,
      name: '巴萨2024-25赛季主场球衣',
      category: 'jersey',
      price: 699,
      memberPrice: 664,
      image: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=500',
      description: '正品授权，经典红蓝条纹',
      link: 'https://www.nike.com',
      platform: 'Nike官方商城',
    },
    {
      id: 4,
      name: '利物浦2024-25赛季主场球衣',
      category: 'jersey',
      price: 699,
      memberPrice: 664,
      image: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=500',
      description: '正品授权，红军战袍',
      link: 'https://www.nike.com',
      platform: 'Nike官方商城',
    },

    // 直播会员类
    {
      id: 11,
      name: '英超全季通会员',
      category: 'membership',
      price: 588,
      memberPrice: 559,
      image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=500',
      description: '观看全部380场英超比赛，高清直播无广告',
      badge: '🎬 热门',
      badgeColor: 'bg-purple-500',
      link: 'https://www.pptv.com',
      platform: 'PP体育',
      hot: true,
    },
    {
      id: 12,
      name: '西甲全季通会员',
      category: 'membership',
      price: 488,
      memberPrice: 464,
      image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500',
      description: '观看全部西甲比赛，包含国家德比',
      link: 'https://www.pptv.com',
      platform: 'PP体育',
    },
    {
      id: 13,
      name: '欧冠会员套餐',
      category: 'membership',
      price: 298,
      memberPrice: 283,
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500',
      description: '观看全部欧冠比赛，含淘汰赛和决赛',
      badge: '⚽ 推荐',
      badgeColor: 'bg-blue-500',
      link: 'https://sports.qq.com',
      platform: '腾讯体育',
      hot: true,
    },
    {
      id: 14,
      name: '全平台体育会员',
      category: 'membership',
      price: 888,
      memberPrice: 844,
      image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=500',
      description: '包含英超、西甲、意甲、德甲、欧冠全部赛事',
      badge: '💎 超值',
      badgeColor: 'bg-green-500',
      link: 'https://www.pptv.com',
      platform: 'PP体育',
    },

    // 门票类
    {
      id: 21,
      name: '曼联主场比赛门票',
      category: 'ticket',
      price: 1200,
      memberPrice: 1140,
      image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500',
      description: '老特拉福德球场，含往返交通和赛前参观',
      badge: '🎫 限量',
      badgeColor: 'bg-orange-500',
      link: 'https://www.manutd.com',
      platform: '曼联官方',
      hot: true,
    },
    {
      id: 22,
      name: '诺坎普观赛套票',
      category: 'ticket',
      price: 1500,
      memberPrice: 1425,
      image: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=500',
      description: '巴萨主场，VIP看台，含球场博物馆门票',
      link: 'https://www.fcbarcelona.com',
      platform: '巴萨官方',
    },
    {
      id: 23,
      name: '欧冠决赛门票',
      category: 'ticket',
      price: 3800,
      memberPrice: 3610,
      image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=500',
      description: '2025年欧冠决赛，二档座位，包含接送服务',
      badge: '🏆 珍藏',
      badgeColor: 'bg-yellow-500',
      link: 'https://www.uefa.com',
      platform: 'UEFA官方',
      hot: true,
    },
    {
      id: 24,
      name: '英超德比大战门票',
      category: 'ticket',
      price: 1800,
      memberPrice: 1710,
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500',
      description: '曼联vs曼城，伊蒂哈德球场',
      link: 'https://www.mancity.com',
      platform: '曼城官方',
    },

    // 周边商品类
    {
      id: 31,
      name: '足球训练装备套装',
      category: 'merchandise',
      price: 399,
      memberPrice: 379,
      image: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=500',
      description: '含足球、护腿板、训练服，专业品质',
      link: 'https://www.nike.com',
      platform: 'Nike官方商城',
    },
    {
      id: 32,
      name: '球队定制围巾',
      category: 'merchandise',
      price: 199,
      memberPrice: 189,
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500',
      description: '刺绣工艺，支持多队徽定制',
      link: 'https://www.taobao.com',
      platform: '淘宝官方店',
    },
    {
      id: 33,
      name: '签名足球收藏版',
      category: 'merchandise',
      price: 899,
      memberPrice: 854,
      image: 'https://images.unsplash.com/photo-1614632537239-f92afd3ffa5a?w=500',
      description: '球星真迹签名，带证书，限量版',
      badge: '✍️ 签名',
      badgeColor: 'bg-indigo-500',
      link: 'https://www.jd.com',
      platform: '京东自营',
    },
    {
      id: 34,
      name: '球队纪念版手办',
      category: 'merchandise',
      price: 299,
      memberPrice: 284,
      image: 'https://images.unsplash.com/photo-1563291074-2bf8677ac0e5?w=500',
      description: '高度还原球星形象，可动关节',
      link: 'https://www.taobao.com',
      platform: '淘宝官方店',
    },
  ];

  const filteredProducts = products.filter((product) => {
    const matchCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleBuyClick = (product: Product) => {
    // 在新标签页打开购买链接
    window.open(product.link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-4 shadow-lg">
            <ShoppingBag className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2 text-gray-800 dark:text-gray-100">
            球迷商城
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            正品授权 · 官方渠道 · 会员享95折优惠
          </p>
        </div>

        {/* 会员福利横幅 */}
        <div className="mb-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Crown className="w-8 h-8" />
              <div>
                <h3 className="font-bold text-lg">会员专享95折</h3>
                <p className="text-sm opacity-90">升级Pro会员，所有商品立享优惠</p>
              </div>
            </div>
            <button
              onClick={() => window.location.href = '/membership'}
              className="px-6 py-3 bg-white text-orange-500 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              立即开通会员
            </button>
          </div>
        </div>

        {/* 搜索和筛选 */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          {/* 搜索框 */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索商品..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* 分类筛选按钮组 */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category.id
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <category.icon className="w-5 h-5" />
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* 商品列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1"
            >
              {/* 商品图片 */}
              <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
                {/* 热门标签 */}
                {product.hot && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    🔥 热销
                  </div>
                )}
                {/* 徽章 */}
                {product.badge && (
                  <div className={`absolute top-3 right-3 ${product.badgeColor || 'bg-gray-500'} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
                    {product.badge}
                  </div>
                )}
              </div>

              {/* 商品信息 */}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-100 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {product.description}
                </p>

                {/* 价格 */}
                <div className="mb-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      ¥{product.price}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      原价
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Crown className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                      会员价 ¥{product.memberPrice}
                    </span>
                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded">
                      省¥{product.price - product.memberPrice}
                    </span>
                  </div>
                </div>

                {/* 购买按钮 */}
                <button
                  onClick={() => handleBuyClick(product)}
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  去{product.platform}购买
                </button>

                {/* 平台标识 */}
                <div className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
                  由 {product.platform} 提供
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 空状态 */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              暂无商品
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              试试搜索其他关键词或切换分类
            </p>
          </div>
        )}

        {/* 购物须知 */}
        <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            购物须知
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <strong className="text-gray-800 dark:text-gray-200">• 正品保证：</strong>
              所有商品均来自官方授权渠道
            </div>
            <div>
              <strong className="text-gray-800 dark:text-gray-200">• 会员优惠：</strong>
              Pro会员享受全场95折优惠
            </div>
            <div>
              <strong className="text-gray-800 dark:text-gray-200">• 外部链接：</strong>
              点击购买将跳转至官方商城完成交易
            </div>
            <div>
              <strong className="text-gray-800 dark:text-gray-200">• 售后服务：</strong>
              由各平台官方提供售后保障
            </div>
          </div>
          <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              💡 <strong>温馨提示：</strong>
              目前商城商品链接至外部官方渠道，后续将推出自营商城，敬请期待！
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
