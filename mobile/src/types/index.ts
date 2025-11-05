// 比赛相关类型
export interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  startTime: string;
  status: 'scheduled' | 'live' | 'finished';
  league: string;
  venue?: string;
}

// 球队相关类型
export interface Team {
  id: number;
  name: string;
  logo?: string;
  founded?: number;
  venue?: string;
  league: string;
}

// 新闻相关类型
export interface News {
  id: number;
  title: string;
  summary: string;
  content: string;
  imageUrl?: string;
  publishedAt: string;
  author: string;
  category: string;
}

// 积分榜相关类型
export interface StandingTeam {
  rank: number;
  team: string;
  logo?: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form?: string[];
}

export interface Standing {
  league: string;
  season: string;
  teams: StandingTeam[];
}

// 论坛相关类型
export interface ForumPost {
  id: number;
  title: string;
  content: string;
  author: string;
  authorAvatar?: string;
  category: string;
  tags: string[];
  views: number;
  likes: number;
  commentsCount: number;
  createdAt: string;
  isHot: boolean;
  isPinned: boolean;
}

export interface ForumComment {
  id: number;
  postId: number;
  content: string;
  author: string;
  authorAvatar?: string;
  likes: number;
  parentId?: number;
  createdAt: string;
  replies?: ForumComment[];
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
