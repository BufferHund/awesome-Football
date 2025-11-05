# 足球数据API使用指南

本项目支持两种数据获取方式：
1. **免费足球API** - API-Football (推荐)
2. **网页爬虫** - Google/FlashScore/ESPN (备选)

## 1. 免费足球API - API-Football

### 注册获取API Key

1. 访问 https://www.api-football.com/
2. 点击"Register"注册账号
3. 登录后进入Dashboard
4. 复制你的API Key

### 免费版限制

- **每天100次请求**
- 涵盖所有主要联赛
- 实时比分更新
- 积分榜数据
- 球队和球员信息

### 配置API Key

编辑 `backend/.env`:
```env
FOOTBALL_API_KEY=your-api-key-here
ENABLE_AUTO_SYNC=true
```

### 自动同步

启动后端后，系统会自动：
- ✅ 每5分钟更新直播比赛
- ✅ 每小时更新今日比赛
- ✅ 每天凌晨2点更新积分榜

### 手动同步API

```bash
# 同步今日比赛
POST /api/sync/matches/today

# 同步直播比赛
POST /api/sync/matches/live

# 同步英超积分榜
POST /api/sync/standings/premier-league

# 支持的联赛:
# - premier-league (英超)
# - la-liga (西甲)
# - bundesliga (德甲)
# - serie-a (意甲)
# - ligue-1 (法甲)
```

## 2. 网页爬虫方式

当API配额用完时，可以使用爬虫获取数据。

### Google比分爬虫

```bash
GET /api/sync/scrape/google?q=football+scores+today
```

返回示例:
```json
{
  "data": [
    {
      "homeTeam": "Manchester City",
      "awayTeam": "Arsenal",
      "homeScore": "2",
      "awayScore": "1",
      "time": "FT"
    }
  ],
  "count": 10,
  "success": true
}
```

### FlashScore爬虫

```bash
GET /api/sync/scrape/flashscore
```

### ESPN爬虫

```bash
GET /api/sync/scrape/espn
```

## 3. 数据流程

```
API-Football / 爬虫
      ↓
  同步服务 (syncService)
      ↓
  PostgreSQL数据库
      ↓
  Express API
      ↓
  React前端
```

## 4. API端点完整列表

### 比赛相关
```
GET  /api/matches              # 所有比赛
GET  /api/matches/:id          # 比赛详情
GET  /api/matches/today/list   # 今日比赛
GET  /api/matches/live/now     # 直播比赛
```

### 球队相关
```
GET  /api/teams                # 所有球队
GET  /api/teams/:id            # 球队详情
```

### 球员相关
```
GET  /api/players              # 所有球员
GET  /api/players/:id          # 球员详情
```

### 积分榜
```
GET  /api/standings?competition=英超    # 指定联赛积分榜
GET  /api/standings/competitions/list  # 所有联赛列表
```

### 新闻
```
GET  /api/news                 # 新闻列表
GET  /api/news/:id             # 新闻详情
```

### 数据同步
```
POST /api/sync/matches/today           # 同步今日比赛
POST /api/sync/matches/live            # 同步直播比赛
POST /api/sync/standings/:league       # 同步积分榜
GET  /api/sync/scrape/google           # Google爬虫
GET  /api/sync/scrape/flashscore       # FlashScore爬虫
GET  /api/sync/scrape/espn             # ESPN爬虫
```

## 5. 热门联赛ID

```javascript
PREMIER_LEAGUE: 39      // 英超
LA_LIGA: 140           // 西甲
BUNDESLIGA: 78         // 德甲
SERIE_A: 135           // 意甲
LIGUE_1: 61            // 法甲
CHAMPIONS_LEAGUE: 2    // 欧冠
EUROPA_LEAGUE: 3       // 欧联
WORLD_CUP: 1           // 世界杯
```

## 6. 错误处理

API调用失败时会自动回退到本地数据库数据。

## 7. 最佳实践

1. **优先使用API** - 数据更准确实时
2. **合理控制请求** - 避免超过免费配额
3. **缓存数据** - 数据库作为缓存层
4. **爬虫备选** - 配额用完时的备选方案
5. **监控日志** - 关注同步状态

## 8. 性能优化

- ✅ 自动定时同步，减少实时请求
- ✅ 数据库缓存，提高响应速度
- ✅ 批量请求，节省API配额
- ✅ 错误重试机制

## 9. 其他免费API推荐

如果API-Football配额不够，可以考虑：

1. **TheSportsDB** - https://www.thesportsdb.com/
   - 免费，有限制
   - 球队、球员、联赛数据

2. **Football-Data.org** - https://www.football-data.org/
   - 免费层：每分钟10次请求
   - 欧洲主要联赛

3. **OpenLigaDB** (德国联赛)
   - 完全免费
   - 德甲数据详细

## 10. 升级到付费版

如果需要更多请求：
- API-Football Pro: $15/月 (1000次/天)
- API-Football Ultra: $45/月 (10000次/天)

---

📊 **数据驱动，实时更新！**
