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
  createdAt?: string;
}
