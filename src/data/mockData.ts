import { Team, Player, Match } from '../models/types';

// Mock 球队数据
export const mockTeams: Omit<Team, 'id'>[] = [
  {
    name: '皇家马德里',
    country: '西班牙',
    founded: 1902,
    stadium: '伯纳乌球场'
  },
  {
    name: '巴塞罗那',
    country: '西班牙',
    founded: 1899,
    stadium: '诺坎普球场'
  },
  {
    name: '曼联',
    country: '英格兰',
    founded: 1878,
    stadium: '老特拉福德球场'
  },
  {
    name: '拜仁慕尼黑',
    country: '德国',
    founded: 1900,
    stadium: '安联球场'
  },
  {
    name: '巴黎圣日耳曼',
    country: '法国',
    founded: 1970,
    stadium: '王子公园球场'
  }
];

// Mock 球员数据 (teamId 将在保存球队后动态设置)
export const getMockPlayers = (teamIds: number[]): Omit<Player, 'id'>[] => [
  // 皇家马德里球员
  {
    name: '维尼修斯',
    teamId: teamIds[0],
    position: '前锋',
    age: 23,
    nationality: '巴西'
  },
  {
    name: '贝林厄姆',
    teamId: teamIds[0],
    position: '中场',
    age: 20,
    nationality: '英格兰'
  },
  {
    name: '库尔图瓦',
    teamId: teamIds[0],
    position: '门将',
    age: 31,
    nationality: '比利时'
  },
  // 巴塞罗那球员
  {
    name: '莱万多夫斯基',
    teamId: teamIds[1],
    position: '前锋',
    age: 35,
    nationality: '波兰'
  },
  {
    name: '佩德里',
    teamId: teamIds[1],
    position: '中场',
    age: 21,
    nationality: '西班牙'
  },
  {
    name: '特尔施特根',
    teamId: teamIds[1],
    position: '门将',
    age: 31,
    nationality: '德国'
  },
  // 曼联球员
  {
    name: '拉什福德',
    teamId: teamIds[2],
    position: '前锋',
    age: 26,
    nationality: '英格兰'
  },
  {
    name: '布鲁诺·费尔南德斯',
    teamId: teamIds[2],
    position: '中场',
    age: 29,
    nationality: '葡萄牙'
  },
  // 拜仁慕尼黑球员
  {
    name: '哈里·凯恩',
    teamId: teamIds[3],
    position: '前锋',
    age: 30,
    nationality: '英格兰'
  },
  {
    name: '穆西亚拉',
    teamId: teamIds[3],
    position: '中场',
    age: 20,
    nationality: '德国'
  },
  // 巴黎圣日耳曼球员
  {
    name: '姆巴佩',
    teamId: teamIds[4],
    position: '前锋',
    age: 25,
    nationality: '法国'
  },
  {
    name: '维拉蒂',
    teamId: teamIds[4],
    position: '中场',
    age: 31,
    nationality: '意大利'
  }
];

// Mock 比赛数据 (teamId 将在保存球队后动态设置)
export const getMockMatches = (teamIds: number[]): Omit<Match, 'id'>[] => [
  {
    homeTeamId: teamIds[0],
    awayTeamId: teamIds[1],
    homeScore: 2,
    awayScore: 1,
    matchDate: '2024-11-01',
    competition: '西甲联赛',
    status: 'finished' // 已结束的比赛
  },
  {
    homeTeamId: teamIds[1],
    awayTeamId: teamIds[0],
    homeScore: 1,
    awayScore: 3,
    matchDate: '2024-10-15',
    competition: '西甲联赛',
    status: 'finished' // 已结束的比赛
  },
  {
    homeTeamId: teamIds[2],
    awayTeamId: teamIds[3],
    homeScore: 0,
    awayScore: 0,
    matchDate: '2025-11-20',
    competition: '欧冠联赛',
    status: 'upcoming' // 即将开始的比赛（可以投注）
  },
  {
    homeTeamId: teamIds[3],
    awayTeamId: teamIds[4],
    homeScore: 0,
    awayScore: 0,
    matchDate: '2025-11-25',
    competition: '欧冠联赛',
    status: 'upcoming' // 即将开始的比赛（可以投注）
  },
  {
    homeTeamId: teamIds[4],
    awayTeamId: teamIds[2],
    homeScore: 0,
    awayScore: 0,
    matchDate: '2025-12-05',
    competition: '友谊赛',
    status: 'upcoming' // 即将开始的比赛（可以投注）
  }
];
