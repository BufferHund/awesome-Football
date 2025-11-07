# awesome-Football ⚽

一个功能完整的足球应用演示，包含数据持久化、商品系统和趣味猜球功能。

## 🎯 功能特性

### 核心功能
✅ **Mock数据持久化** - Mock数据会自动保存到SQLite数据库
✅ **爬虫数据持久化** - 爬虫获取的数据会自动保存到数据库
✅ **API数据持久化** - 通过API创建的数据会持久化到数据库
✅ **RESTful API** - 提供完整的CRUD接口
✅ **TypeScript** - 类型安全的代码
✅ **SQLite数据库** - 轻量级本地数据库持久化

### 新增功能
🛍️ **商品系统** - 12件足球相关商品，支持分类查询
🎲 **趣味猜球** - 虚拟金币投注系统，支持主胜/客胜/平局投注
👥 **用户系统** - 用户管理、金币系统、投注统计
🏆 **排行榜** - 根据用户金币数量排名

## 项目结构

```
awesome-Football/
├── src/
│   ├── models/          # 数据模型定义
│   │   └── types.ts     # Team, Player, Match, Product, User, Bet
│   ├── database/        # 数据库相关
│   │   ├── schema.ts    # 数据库表结构（6张表）
│   │   └── db.ts        # 数据库操作（持久化逻辑）
│   ├── data/           # Mock数据
│   │   ├── mockData.ts        # 球队、球员、比赛数据
│   │   ├── productMockData.ts # 商品数据
│   │   └── userMockData.ts    # 用户数据
│   ├── services/       # 业务逻辑
│   │   └── bettingService.ts  # 猜球服务（投注、结算）
│   ├── crawler/        # 爬虫模块
│   │   └── footballCrawler.ts  # 爬虫逻辑（含持久化）
│   ├── api/            # API模块
│   │   ├── routes.ts   # API路由（含持久化）
│   │   └── server.ts   # 服务器配置
│   ├── scripts/        # 工具脚本
│   │   └── initDatabase.ts  # 数据库初始化脚本
│   └── index.ts        # 应用入口
├── package.json
├── tsconfig.json
└── football.db         # SQLite数据库文件（运行后生成）
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 初始化数据库（可选）

使用Mock数据初始化数据库：

```bash
npm run init-db
```

### 3. 启动应用

```bash
npm run dev
```

应用将会：
1. 自动将Mock数据持久化到数据库（球队、球员、比赛、商品、用户）
2. 运行爬虫获取额外数据并持久化
3. 启动API服务器在 `http://localhost:2000`

## 📡 API端点

### 球队相关

- `GET /api/teams` - 获取所有球队
- `GET /api/teams/:id` - 根据ID获取球队
- `POST /api/teams` - 创建新球队（持久化到数据库）

### 球员相关

- `GET /api/players` - 获取所有球员
- `GET /api/players/team/:teamId` - 获取指定球队的球员
- `POST /api/players` - 创建新球员（持久化到数据库）

### 比赛相关

- `GET /api/matches` - 获取所有比赛
- `GET /api/matches/team/:teamId` - 获取指定球队的比赛
- `POST /api/matches` - 创建新比赛（持久化到数据库）
- `PUT /api/matches/:id/result` - 更新比赛结果并自动结算投注

### 🛍️ 商品相关

- `GET /api/products` - 获取所有商品
- `GET /api/products/:id` - 根据ID获取商品
- `GET /api/products/category/:category` - 根据分类获取商品
- `POST /api/products` - 创建新商品（持久化到数据库）

### 👥 用户相关

- `GET /api/users` - 获取所有用户
- `GET /api/users/:id` - 根据ID获取用户
- `GET /api/users/:id/stats` - 获取用户投注统计
- `POST /api/users` - 创建新用户

### 🎲 猜球相关

- `POST /api/bets` - 创建投注（持久化到数据库）
- `GET /api/bets/user/:userId` - 获取用户的所有投注
- `GET /api/bets/match/:matchId` - 获取比赛的所有投注
- `GET /api/bets/match/:matchId/stats` - 获取比赛投注统计
- `POST /api/bets/settle/:matchId` - 结算比赛投注（管理员）
- `GET /api/leaderboard` - 获取金币排行榜

### 统计信息

- `GET /api/stats` - 获取数据库统计信息

## 数据持久化说明

本项目的所有数据都会持久化到SQLite数据库（`football.db`文件）：

### 1. Mock数据持久化

Mock数据在 `src/data/mockData.ts` 中定义，应用启动时会自动保存到数据库。

```typescript
// src/data/mockData.ts
export const mockTeams = [
  { name: '皇家马德里', country: '西班牙', ... }
];
```

### 2. 爬虫数据持久化

爬虫在 `src/crawler/footballCrawler.ts` 中实现，获取的数据会自动保存到数据库。

```typescript
// 爬虫会自动将获取的数据持久化
await crawler.crawlAndSaveTeams();      // 保存球队到数据库
await crawler.crawlAndSavePlayers();    // 保存球员到数据库
await crawler.crawlAndSaveMatches();    // 保存比赛到数据库
```

### 3. API数据持久化

通过API创建的数据会立即持久化到数据库。

```bash
# 创建新球队（会持久化到数据库）
curl -X POST http://localhost:2000/api/teams \
  -H "Content-Type: application/json" \
  -d '{
    "name": "切尔西",
    "country": "英格兰",
    "founded": 1905,
    "stadium": "斯坦福桥球场"
  }'
```

## 💡 使用示例

### 1. 查询球队和球员

```bash
# 获取所有球队
curl http://localhost:2000/api/teams

# 获取球队的球员
curl http://localhost:2000/api/players/team/1
```

### 2. 查询商品

```bash
# 获取所有商品
curl http://localhost:2000/api/products

# 根据分类查询商品
curl http://localhost:2000/api/products/category/球衣
```

### 3. 趣味猜球 - 完整流程

```bash
# 步骤1: 获取所有用户
curl http://localhost:2000/api/users

# 步骤2: 获取即将开始的比赛
curl http://localhost:2000/api/matches

# 步骤3: 用户1对比赛3投注（主队胜，投注100金币）
curl -X POST http://localhost:2000/api/bets \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "matchId": 3,
    "betType": "home",
    "amount": 100
  }'

# 步骤4: 查看用户的投注记录
curl http://localhost:2000/api/bets/user/1

# 步骤5: 更新比赛结果（管理员操作，自动结算投注）
curl -X PUT http://localhost:2000/api/matches/3/result \
  -H "Content-Type: application/json" \
  -d '{
    "homeScore": 2,
    "awayScore": 1,
    "status": "finished"
  }'

# 步骤6: 查看用户投注统计
curl http://localhost:2000/api/users/1/stats

# 步骤7: 查看金币排行榜
curl http://localhost:2000/api/leaderboard
```

### 4. 创建新数据

```bash
# 创建新球员
curl -X POST http://localhost:2000/api/players \
  -H "Content-Type: application/json" \
  -d '{
    "name": "哈兰德",
    "teamId": 1,
    "position": "前锋",
    "age": 23,
    "nationality": "挪威"
  }'

# 创建新商品
curl -X POST http://localhost:2000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "足球袜子",
    "description": "专业足球袜",
    "price": 39,
    "category": "装备",
    "stock": 200
  }'
```

## 技术栈

- **Node.js** - 运行环境
- **TypeScript** - 类型安全的JavaScript
- **Express** - Web框架
- **SQLite3** - 轻量级数据库
- **Axios** - HTTP客户端（用于爬虫）
- **Cheerio** - HTML解析器（用于爬虫）

## 开发命令

```bash
npm run dev      # 开发模式运行
npm run build    # 编译TypeScript
npm start        # 生产模式运行
npm run init-db  # 初始化数据库
```

## ⚠️ 重要说明

### 数据持久化
- 数据库文件 `football.db` 会在第一次运行时自动创建
- 所有数据（球队、球员、比赛、商品、用户、投注）都持久化在本地SQLite数据库中
- Mock数据会在应用启动时自动保存到数据库
- 爬虫模块目前使用模拟数据，可以替换为真实的API调用

### 趣味猜球系统
- ⚠️ **纯娱乐性质** - 这是一个趣味猜球系统，使用虚拟金币，不涉及真实货币
- 每个新用户默认获得 1000 虚拟金币
- 只能对状态为 `upcoming`（即将开始）的比赛进行投注
- 投注类型：`home`（主队胜）、`away`（客队胜）、`draw`（平局）
- 比赛结果更新为 `finished` 时会自动结算所有相关投注
- 赢了的投注会自动发放奖金到用户账户
- 无浏览器窗口提醒功能，所有通知通过 API 响应和日志输出

### 商品系统
- 12件足球相关商品（球衣、装备、训练器材、周边）
- 支持按分类查询：球衣、装备、训练器材、周边
- 商品数据会持久化到数据库

## License

MIT
