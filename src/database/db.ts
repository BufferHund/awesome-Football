import sqlite3 from 'sqlite3';
import { Team, Player, Match } from '../models/types';
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
      const sql = `INSERT INTO matches (homeTeamId, awayTeamId, homeScore, awayScore, matchDate, competition)
                   VALUES (?, ?, ?, ?, ?, ?)`;
      this.db.run(
        sql,
        [match.homeTeamId, match.awayTeamId, match.homeScore, match.awayScore, match.matchDate, match.competition],
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

  // 清空所有数据（仅用于测试）
  public clearAllData(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
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
