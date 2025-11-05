import axios from 'axios';
import { Match, Team, Player, Standing, News, ForumPost, ForumComment } from '../types';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

export const matchService = {
  getAll: (params?: { status?: string; competition?: string; date?: string }) =>
    api.get<Match[]>('/matches', { params }),

  getById: (id: number) =>
    api.get<Match>(`/matches/${id}`),

  getToday: () =>
    api.get<Match[]>('/matches/today/list'),

  getLive: () =>
    api.get<Match[]>('/matches/live/now'),
};

export const teamService = {
  getAll: (params?: { country?: string }) =>
    api.get<Team[]>('/teams', { params }),

  getById: (id: number) =>
    api.get<Team>(`/teams/${id}`),
};

export const playerService = {
  getAll: (params?: { teamId?: number; position?: string }) =>
    api.get<Player[]>('/players', { params }),

  getById: (id: number) =>
    api.get<Player>(`/players/${id}`),
};

export const standingService = {
  getByCompetition: (competition: string) =>
    api.get<Standing[]>('/standings', { params: { competition } }),

  getCompetitions: () =>
    api.get<string[]>('/standings/competitions/list'),
};

export const newsService = {
  getAll: (params?: { category?: string; limit?: number }) =>
    api.get<News[]>('/news', { params }),

  getById: (id: number) =>
    api.get<News>(`/news/${id}`),
};

export const scraperService = {
  // 新闻爬虫
  scrapeESPNNews: () =>
    api.get<any[]>('/sync/scrape/news/espn'),

  scrapeGoalNews: () =>
    api.get<any[]>('/sync/scrape/news/goal'),

  // 积分榜爬虫
  scrapeESPNStandings: (league?: string) =>
    api.get<any[]>(`/sync/scrape/standings/espn${league ? `/${league}` : ''}`),
};

export const forumService = {
  // 获取帖子列表
  getPosts: (params?: { page?: number; limit?: number; category?: string; sortBy?: string }) =>
    api.get<{ data: ForumPost[]; pagination: any }>('/forum/posts', { params }),

  // 获取帖子详情
  getPostById: (id: number) =>
    api.get<ForumPost>(`/forum/posts/${id}`),

  // 创建帖子
  createPost: (data: {
    title: string;
    content: string;
    category: string;
    tags?: string[];
    images?: string[];
    author?: string;
    authorAvatar?: string;
  }) =>
    api.post<ForumPost>('/forum/posts', data),

  // 点赞帖子
  likePost: (id: number) =>
    api.post<ForumPost>(`/forum/posts/${id}/like`),

  // 获取帖子评论
  getComments: (postId: number, params?: { page?: number; limit?: number }) =>
    api.get<{ data: ForumComment[]; pagination: any }>(`/forum/posts/${postId}/comments`, { params }),

  // 创建评论
  createComment: (postId: number, data: {
    content: string;
    author?: string;
    authorAvatar?: string;
    parentId?: number;
  }) =>
    api.post<ForumComment>(`/forum/posts/${postId}/comments`, data),

  // 点赞评论
  likeComment: (id: number) =>
    api.post<ForumComment>(`/forum/comments/${id}/like`),

  // 删除帖子
  deletePost: (id: number) =>
    api.delete(`/forum/posts/${id}`),

  // 删除评论
  deleteComment: (id: number) =>
    api.delete(`/forum/comments/${id}`),
};
