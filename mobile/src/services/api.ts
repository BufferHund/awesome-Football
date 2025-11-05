import axios from 'axios';
import { Match, Team, News, Standing, ForumPost, ForumComment } from '../types';

// API基础URL - 根据环境配置
const API_BASE_URL = __DEV__
  ? 'http://10.0.2.2:3000/api'  // Android模拟器
  : 'https://your-production-api.com/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('Response Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

// 比赛相关API
export const matchService = {
  getTodayMatches: async (): Promise<Match[]> => {
    const response = await apiClient.get<Match[]>('/matches/today');
    return response.data;
  },

  getLiveMatches: async (): Promise<Match[]> => {
    const response = await apiClient.get<Match[]>('/matches/live');
    return response.data;
  },

  getMatchById: async (id: number): Promise<Match> => {
    const response = await apiClient.get<Match>(`/matches/${id}`);
    return response.data;
  },
};

// 球队相关API
export const teamService = {
  getAllTeams: async (): Promise<Team[]> => {
    const response = await apiClient.get<Team[]>('/teams');
    return response.data;
  },

  getTeamById: async (id: number): Promise<Team> => {
    const response = await apiClient.get<Team>(`/teams/${id}`);
    return response.data;
  },
};

// 新闻相关API
export const newsService = {
  getAllNews: async (): Promise<News[]> => {
    const response = await apiClient.get<News[]>('/news');
    return response.data;
  },

  getNewsById: async (id: number): Promise<News> => {
    const response = await apiClient.get<News>(`/news/${id}`);
    return response.data;
  },
};

// 积分榜相关API
export const standingsService = {
  getStandings: async (league: string): Promise<Standing> => {
    const response = await apiClient.get<Standing>(`/standings/${league}`);
    return response.data;
  },
};

// 论坛相关API
export const forumService = {
  getPosts: async (params?: { category?: string; page?: number }): Promise<ForumPost[]> => {
    const response = await apiClient.get<ForumPost[]>('/forum/posts', { params });
    return response.data;
  },

  getPostById: async (id: number): Promise<ForumPost> => {
    const response = await apiClient.get<ForumPost>(`/forum/posts/${id}`);
    return response.data;
  },

  getComments: async (postId: number): Promise<ForumComment[]> => {
    const response = await apiClient.get<ForumComment[]>(`/forum/posts/${postId}/comments`);
    return response.data;
  },

  createPost: async (data: Partial<ForumPost>): Promise<ForumPost> => {
    const response = await apiClient.post<ForumPost>('/forum/posts', data);
    return response.data;
  },

  createComment: async (postId: number, data: Partial<ForumComment>): Promise<ForumComment> => {
    const response = await apiClient.post<ForumComment>(`/forum/posts/${postId}/comments`, data);
    return response.data;
  },
};

export default apiClient;
