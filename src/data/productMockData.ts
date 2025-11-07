import { Product } from '../models/types';

// 商品Mock数据（足球相关商品）
export const mockProducts: Omit<Product, 'id'>[] = [
  {
    name: '皇马官方球衣 2024款',
    description: '皇家马德里官方授权球衣，主场白色经典款',
    price: 599,
    category: '球衣',
    imageUrl: '/images/products/real-madrid-jersey.jpg',
    stock: 100
  },
  {
    name: '巴萨官方球衣 2024款',
    description: '巴塞罗那官方球衣，红蓝间条经典配色',
    price: 599,
    category: '球衣',
    imageUrl: '/images/products/barcelona-jersey.jpg',
    stock: 85
  },
  {
    name: '阿迪达斯 足球',
    description: '官方比赛用球，5号标准足球',
    price: 299,
    category: '装备',
    imageUrl: '/images/products/adidas-football.jpg',
    stock: 200
  },
  {
    name: '耐克 足球鞋',
    description: 'Nike Mercurial 系列足球鞋，专业级装备',
    price: 899,
    category: '装备',
    imageUrl: '/images/products/nike-shoes.jpg',
    stock: 50
  },
  {
    name: '足球训练锥桶套装',
    description: '12个训练锥桶，适合训练使用',
    price: 88,
    category: '训练器材',
    imageUrl: '/images/products/training-cones.jpg',
    stock: 150
  },
  {
    name: '足球围巾',
    description: '球迷必备围巾，多款球队可选',
    price: 79,
    category: '周边',
    imageUrl: '/images/products/football-scarf.jpg',
    stock: 300
  },
  {
    name: '足球纪念徽章套装',
    description: '欧洲五大联赛俱乐部徽章，收藏必备',
    price: 159,
    category: '周边',
    imageUrl: '/images/products/badge-set.jpg',
    stock: 120
  },
  {
    name: '护腿板',
    description: '专业足球护腿板，有效保护小腿',
    price: 129,
    category: '装备',
    imageUrl: '/images/products/shin-guards.jpg',
    stock: 180
  },
  {
    name: '门将手套',
    description: '专业门将手套，强力抓地力',
    price: 199,
    category: '装备',
    imageUrl: '/images/products/goalkeeper-gloves.jpg',
    stock: 75
  },
  {
    name: '足球战术板',
    description: '教练专用战术板，可擦写磁性设计',
    price: 168,
    category: '训练器材',
    imageUrl: '/images/products/tactics-board.jpg',
    stock: 60
  },
  {
    name: '足球训练背心',
    description: '透气训练背心，10件套',
    price: 280,
    category: '训练器材',
    imageUrl: '/images/products/training-vests.jpg',
    stock: 90
  },
  {
    name: '足球主题水杯',
    description: '运动水杯，保温保冷，印有球队logo',
    price: 59,
    category: '周边',
    imageUrl: '/images/products/water-bottle.jpg',
    stock: 250
  }
];
