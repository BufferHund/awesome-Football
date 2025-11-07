import sqlite3 from 'sqlite3';
import { Team, Player, Match, Product, User, Bet } from '../models/types';
import { createTablesSQL } from './schema';

// 数据库连接类
class Database {
  private db: sqlite3.Database;
  private static instance: Database;

  private constructor() {
    this.db = new sqlite3.Database('./football.db', (err) => {
      if (err) {
        console.error('数据库连接失败:', err.message);
      } else {
        console.log('已连接到 SQLite 数据库');
        this.initTables();
      }
    });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  // 初始化数据库表
  private initTables(): void {
    this.db.exec(createTablesSQL, (err) => {
      if (err) {
        console.error('创建表失败:', err.message);
      } else {
        console.log('数据库表初始化成功');
      }
    });
  }

  // ========== 球队操作 ==========

  // 保存球队到数据库
  public saveTeam(team: Omit<Team, 'id'>): Promise<number> {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO teams (name, country, founded, stadium) VALUES (?, ?, ?, ?)`;
      this.db.run(sql, [team.name, team.country, team.founded, team.stadium], function(err) {
        if (err) {
          reject(err);
        } else {
          console.log(`✓ 球队已保存: ${team.name} (ID: ${this.lastID})`);
          resolve(this.lastID);
        }
      });
    });
  }

  // 批量保存球队
  public saveTeams(teams: Omit<Team, 'id'>[]): Promise<number[]> {
    return Promise.all(teams.map(team => this.saveTeam(team)));
  }

  // 获取所有球队
  public getAllTeams(): Promise<Team[]> {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM teams ORDER BY id DESC`;
      this.db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as Team[]);
        }
      });
    });
  }

  // 根据ID获取球队
  public getTeamById(id: number): Promise<Team | undefined> {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM teams WHERE id = ?`;
      this.db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row as Team);
        }
      });
    });
  }

  // ========== 球员操作 ==========

  // 保存球员到数据库
  public savePlayer(player: Omit<Player, 'id'>): Promise<number> {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO players (name, teamId, position, age, nationality) VALUES (?, ?, ?, ?, ?)`;
      this.db.run(
        sql,
        [player.name, player.teamId, player.position, player.age, player.nationality],
        function(err) {
          if (err) {
            reject(err);
          } else {
            console.log(`✓ 球员已保存: ${player.name} (ID: ${this.lastID})`);
            resolve(this.lastID);
          }
        }
      );
    });
  }

  // 批量保存球员
  public savePlayers(players: Omit<Player, 'id'>[]): Promise<number[]> {
    return Promise.all(players.map(player => this.savePlayer(player)));
  }

  // 获取所有球员
  public getAllPlayers(): Promise<Player[]> {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM players ORDER BY id DESC`;
      this.db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as Player[]);
        }
      });
    });
  }

  // 根据球队ID获取球员
  public getPlayersByTeamId(teamId: number): Promise<Player[]> {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM players WHERE teamId = ?`;
      this.db.all(sql, [teamId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as Player[]);
        }
      });
    });
  }

  // ========== 比赛操作 ==========

  // 保存比赛到数据库
  public saveMatch(match: Omit<Match, 'id'>): Promise<number> {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO matches (homeTeamId, awayTeamId, homeScore, awayScore, matchDate, competition, status)
                   VALUES (?, ?, ?, ?, ?, ?, ?)`;
      this.db.run(
        sql,
        [match.homeTeamId, match.awayTeamId, match.homeScore, match.awayScore, match.matchDate, match.competition, match.status || 'upcoming'],
        function(err) {
          if (err) {
            reject(err);
          } else {
            console.log(`✓ 比赛已保存: ID ${this.lastID}`);
            resolve(this.lastID);
          }
        }
      );
    });
  }

  // 批量保存比赛
  public saveMatches(matches: Omit<Match, 'id'>[]): Promise<number[]> {
    return Promise.all(matches.map(match => this.saveMatch(match)));
  }

  // 获取所有比赛
  public getAllMatches(): Promise<Match[]> {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM matches ORDER BY matchDate DESC`;
      this.db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as Match[]);
        }
      });
    });
  }

  // 获取球队的所有比赛
  public getMatchesByTeamId(teamId: number): Promise<Match[]> {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM matches WHERE homeTeamId = ? OR awayTeamId = ? ORDER BY matchDate DESC`;
      this.db.all(sql, [teamId, teamId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as Match[]);
        }
      });
    });
  }

  // 根据状态获取比赛
  public getMatchesByStatus(status: string): Promise<Match[]> {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM matches WHERE status = ? ORDER BY matchDate DESC`;
      this.db.all(sql, [status], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as Match[]);
        }
      });
    });
  }

  // 更新比赛状态和比分
  public updateMatchResult(matchId: number, homeScore: number, awayScore: number, status: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE matches SET homeScore = ?, awayScore = ?, status = ? WHERE id = ?`;
      this.db.run(sql, [homeScore, awayScore, status, matchId], (err) => {
        if (err) {
          reject(err);
        } else {
          console.log(`✓ 比赛 ${matchId} 结果已更新`);
          resolve();
        }
      });
    });
  }

  // ========== 商品操作 ==========

  // 保存商品到数据库
  public saveProduct(product: Omit<Product, 'id'>): Promise<number> {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO products (name, description, price, category, imageUrl, stock)
                   VALUES (?, ?, ?, ?, ?, ?)`;
      this.db.run(
        sql,
        [product.name, product.description, product.price, product.category, product.imageUrl, product.stock],
        function(err) {
          if (err) {
            reject(err);
          } else {
            console.log(`✓ 商品已保存: ${product.name} (ID: ${this.lastID})`);
            resolve(this.lastID);
          }
        }
      );
    });
  }

  // 批量保存商品
  public saveProducts(products: Omit<Product, 'id'>[]): Promise<number[]> {
    return Promise.all(products.map(product => this.saveProduct(product)));
  }

  // 获取所有商品
  public getAllProducts(): Promise<Product[]> {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM products ORDER BY id DESC`;
      this.db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as Product[]);
        }
      });
    });
  }

  // 根据分类获取商品
  public getProductsByCategory(category: string): Promise<Product[]> {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM products WHERE category = ?`;
      this.db.all(sql, [category], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as Product[]);
        }
      });
    });
  }

  // 根据ID获取商品
  public getProductById(id: number): Promise<Product | undefined> {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM products WHERE id = ?`;
      this.db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row as Product);
        }
      });
    });
  }

  // ========== 用户操作 ==========

  // 保存用户到数据库
  public saveUser(user: Omit<User, 'id'>): Promise<number> {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO users (username, email, coins) VALUES (?, ?, ?)`;
      this.db.run(
        sql,
        [user.username, user.email, user.coins || 1000],
        function(err) {
          if (err) {
            reject(err);
          } else {
            console.log(`✓ 用户已保存: ${user.username} (ID: ${this.lastID})`);
            resolve(this.lastID);
          }
        }
      );
    });
  }

  // 获取所有用户
  public getAllUsers(): Promise<User[]> {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM users ORDER BY id DESC`;
      this.db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as User[]);
        }
      });
    });
  }

  // 根据ID获取用户
  public getUserById(id: number): Promise<User | undefined> {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM users WHERE id = ?`;
      this.db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row as User);
        }
      });
    });
  }

  // 根据用户名获取用户
  public getUserByUsername(username: string): Promise<User | undefined> {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM users WHERE username = ?`;
      this.db.get(sql, [username], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row as User);
        }
      });
    });
  }

  // 更新用户金币
  public updateUserCoins(userId: number, coins: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE users SET coins = ? WHERE id = ?`;
      this.db.run(sql, [coins, userId], (err) => {
        if (err) {
          reject(err);
        } else {
          console.log(`✓ 用户 ${userId} 金币已更新: ${coins}`);
          resolve();
        }
      });
    });
  }

  // ========== 投注操作 ==========

  // 保存投注到数据库
  public saveBet(bet: Omit<Bet, 'id'>): Promise<number> {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO bets (userId, matchId, betType, amount, odds, status, potentialWin)
                   VALUES (?, ?, ?, ?, ?, ?, ?)`;
      this.db.run(
        sql,
        [bet.userId, bet.matchId, bet.betType, bet.amount, bet.odds, bet.status || 'pending', bet.potentialWin],
        function(err) {
          if (err) {
            reject(err);
          } else {
            console.log(`✓ 投注已保存: 用户${bet.userId} 在比赛${bet.matchId} 上投注 (ID: ${this.lastID})`);
            resolve(this.lastID);
          }
        }
      );
    });
  }

  // 获取所有投注
  public getAllBets(): Promise<Bet[]> {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM bets ORDER BY createdAt DESC`;
      this.db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as Bet[]);
        }
      });
    });
  }

  // 根据用户ID获取投注
  public getBetsByUserId(userId: number): Promise<Bet[]> {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM bets WHERE userId = ? ORDER BY createdAt DESC`;
      this.db.all(sql, [userId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as Bet[]);
        }
      });
    });
  }

  // 根据比赛ID获取投注
  public getBetsByMatchId(matchId: number): Promise<Bet[]> {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM bets WHERE matchId = ? ORDER BY createdAt DESC`;
      this.db.all(sql, [matchId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as Bet[]);
        }
      });
    });
  }

  // 更新投注状态
  public updateBetStatus(betId: number, status: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE bets SET status = ? WHERE id = ?`;
      this.db.run(sql, [status, betId], (err) => {
        if (err) {
          reject(err);
        } else {
          console.log(`✓ 投注 ${betId} 状态已更新: ${status}`);
          resolve();
        }
      });
    });
  }

  // 清空所有数据（仅用于测试）
  public clearAllData(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run('DELETE FROM bets', (err) => {
          if (err) console.error('清空 bets 表失败:', err);
        });
        this.db.run('DELETE FROM users', (err) => {
          if (err) console.error('清空 users 表失败:', err);
        });
        this.db.run('DELETE FROM products', (err) => {
          if (err) console.error('清空 products 表失败:', err);
        });
        this.db.run('DELETE FROM matches', (err) => {
          if (err) console.error('清空 matches 表失败:', err);
        });
        this.db.run('DELETE FROM players', (err) => {
          if (err) console.error('清空 players 表失败:', err);
        });
        this.db.run('DELETE FROM teams', (err) => {
          if (err) {
            reject(err);
          } else {
            console.log('所有数据已清空');
            resolve();
          }
        });
      });
    });
  }

  // 关闭数据库连接
  public close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err);
        } else {
          console.log('数据库连接已关闭');
          resolve();
        }
      });
    });
  }
}

export default Database;
