// 数据模型类型定义

export interface Team {
  id: number;
  name: string;
  country: string;
  founded: number;
  stadium: string;
  createdAt?: string;
}

export interface Player {
  id: number;
  name: string;
  teamId: number;
  position: string;
  age: number;
  nationality: string;
  createdAt?: string;
}

export interface Match {
  id: number;
  homeTeamId: number;
  awayTeamId: number;
  homeScore: number;
  awayScore: number;
  matchDate: string;
  competition: string;
  status: 'upcoming' | 'ongoing' | 'finished'; // 比赛状态
  createdAt?: string;
}

// 商品数据模型
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  stock: number;
  createdAt?: string;
}

// 用户数据模型
export interface User {
  id: number;
  username: string;
  email: string;
  coins: number; // 虚拟金币（用于趣味猜球）
  createdAt?: string;
}

// 投注记录数据模型
export interface Bet {
  id: number;
  userId: number;
  matchId: number;
  betType: 'home' | 'away' | 'draw'; // 投注类型：主队胜、客队胜、平局
  amount: number; // 投注金额（虚拟金币）
  odds: number; // 赔率
  status: 'pending' | 'won' | 'lost'; // 投注状态
  potentialWin: number; // 潜在收益
  createdAt?: string;
}
