export interface Team {
  id: number;
  name: string;
  shortName: string;
  logo: string | null;
  country: string;
  founded: number | null;
  stadium: string | null;
}

export interface Player {
  id: number;
  name: string;
  position: string;
  number: number | null;
  nationality: string;
  age: number | null;
  photo: string | null;
  teamId: number;
  team?: Team;
}

export interface MatchEvent {
  id: number;
  matchId: number;
  type: string;
  player: string;
  minute: number;
  detail: string | null;
}

export interface Match {
  id: number;
  homeTeamId: number;
  awayTeamId: number;
  homeScore: number | null;
  awayScore: number | null;
  status: 'SCHEDULED' | 'LIVE' | 'FINISHED' | 'POSTPONED';
  matchDate: string;
  venue: string | null;
  competition: string;
  round: string | null;
  homeTeam: Team;
  awayTeam: Team;
  events?: MatchEvent[];
}

export interface Standing {
  id: number;
  teamId: number;
  competition: string;
  position: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
  form: string | null;
  team: Team;
}

export interface News {
  id: number;
  title: string;
  summary: string | null;
  content: string;
  coverImage: string | null;
  category: string;
  author: string | null;
  publishDate: string;
  views: number;
}
