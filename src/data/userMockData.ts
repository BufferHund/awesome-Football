import { User } from '../models/types';

// 用户Mock数据（用于趣味赌球功能）
export const mockUsers: Omit<User, 'id'>[] = [
  {
    username: '足球狂热者',
    email: 'fan1@example.com',
    coins: 1000
  },
  {
    username: '赌球达人',
    email: 'betmaster@example.com',
    coins: 2500
  },
  {
    username: '新手玩家',
    email: 'newbie@example.com',
    coins: 500
  },
  {
    username: '资深球迷',
    email: 'veteran@example.com',
    coins: 5000
  },
  {
    username: '幸运儿',
    email: 'lucky@example.com',
    coins: 10000
  }
];
