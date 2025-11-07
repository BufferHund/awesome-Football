// 数据库表结构定义

export const createTablesSQL = `
  -- 球队表
  CREATE TABLE IF NOT EXISTS teams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    country TEXT NOT NULL,
    founded INTEGER,
    stadium TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- 球员表
  CREATE TABLE IF NOT EXISTS players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    teamId INTEGER NOT NULL,
    position TEXT NOT NULL,
    age INTEGER,
    nationality TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teamId) REFERENCES teams(id)
  );

  -- 比赛表
  CREATE TABLE IF NOT EXISTS matches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    homeTeamId INTEGER NOT NULL,
    awayTeamId INTEGER NOT NULL,
    homeScore INTEGER DEFAULT 0,
    awayScore INTEGER DEFAULT 0,
    matchDate TEXT NOT NULL,
    competition TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (homeTeamId) REFERENCES teams(id),
    FOREIGN KEY (awayTeamId) REFERENCES teams(id)
  );

  -- 创建索引以提升查询性能
  CREATE INDEX IF NOT EXISTS idx_players_teamId ON players(teamId);
  CREATE INDEX IF NOT EXISTS idx_matches_homeTeamId ON matches(homeTeamId);
  CREATE INDEX IF NOT EXISTS idx_matches_awayTeamId ON matches(awayTeamId);
  CREATE INDEX IF NOT EXISTS idx_matches_date ON matches(matchDate);
`;
