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
    status TEXT DEFAULT 'upcoming',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (homeTeamId) REFERENCES teams(id),
    FOREIGN KEY (awayTeamId) REFERENCES teams(id)
  );

  -- 商品表
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    category TEXT NOT NULL,
    imageUrl TEXT,
    stock INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- 用户表
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    coins INTEGER DEFAULT 1000,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- 投注表
  CREATE TABLE IF NOT EXISTS bets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    matchId INTEGER NOT NULL,
    betType TEXT NOT NULL,
    amount REAL NOT NULL,
    odds REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    potentialWin REAL NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (matchId) REFERENCES matches(id)
  );

  -- 创建索引以提升查询性能
  CREATE INDEX IF NOT EXISTS idx_players_teamId ON players(teamId);
  CREATE INDEX IF NOT EXISTS idx_matches_homeTeamId ON matches(homeTeamId);
  CREATE INDEX IF NOT EXISTS idx_matches_awayTeamId ON matches(awayTeamId);
  CREATE INDEX IF NOT EXISTS idx_matches_date ON matches(matchDate);
  CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
  CREATE INDEX IF NOT EXISTS idx_bets_userId ON bets(userId);
  CREATE INDEX IF NOT EXISTS idx_bets_matchId ON bets(matchId);
  CREATE INDEX IF NOT EXISTS idx_bets_status ON bets(status);
  CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
`;
