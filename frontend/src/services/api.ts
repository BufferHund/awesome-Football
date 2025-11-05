import axios from 'axios';
import { Match, Team, Player, Standing, News } from '../types';

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
