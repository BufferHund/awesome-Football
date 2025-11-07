# awesome-Football ⚽

一个完整的足球数据应用演示，包含爬虫、API和数据库持久化功能。

## 功能特性

✅ **Mock数据持久化** - Mock数据会自动保存到SQLite数据库
✅ **爬虫数据持久化** - 爬虫获取的数据会自动保存到数据库
✅ **API数据持久化** - 通过API创建的数据会持久化到数据库
✅ **RESTful API** - 提供完整的CRUD接口
✅ **TypeScript** - 类型安全的代码
✅ **SQLite数据库** - 轻量级本地数据库持久化

## 项目结构

```
awesome-Football/
├── src/
│   ├── models/          # 数据模型定义
│   │   └── types.ts
│   ├── database/        # 数据库相关
│   │   ├── schema.ts    # 数据库表结构
│   │   └── db.ts        # 数据库操作（持久化逻辑）
│   ├── data/           # Mock数据
│   │   └── mockData.ts
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
1. 自动将Mock数据持久化到数据库
2. 运行爬虫获取额外数据并持久化
3. 启动API服务器在 `http://localhost:3000`

## API端点

### 球队相关

- `GET /api/teams` - 获取所有球队（从数据库读取）
- `GET /api/teams/:id` - 根据ID获取球队
- `POST /api/teams` - 创建新球队（**持久化到数据库**）

### 球员相关

- `GET /api/players` - 获取所有球员（从数据库读取）
- `GET /api/players/team/:teamId` - 获取指定球队的球员
- `POST /api/players` - 创建新球员（**持久化到数据库**）

### 比赛相关

- `GET /api/matches` - 获取所有比赛（从数据库读取）
- `GET /api/matches/team/:teamId` - 获取指定球队的比赛
- `POST /api/matches` - 创建新比赛（**持久化到数据库**）

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
curl -X POST http://localhost:3000/api/teams \
  -H "Content-Type: application/json" \
  -d '{
    "name": "切尔西",
    "country": "英格兰",
    "founded": 1905,
    "stadium": "斯坦福桥球场"
  }'
```

## 使用示例

### 1. 获取所有球队

```bash
curl http://localhost:3000/api/teams
```

### 2. 创建新球员

```bash
curl -X POST http://localhost:3000/api/players \
  -H "Content-Type: application/json" \
  -d '{
    "name": "哈兰德",
    "teamId": 1,
    "position": "前锋",
    "age": 23,
    "nationality": "挪威"
  }'
```

### 3. 获取统计信息

```bash
curl http://localhost:3000/api/stats
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

## 注意事项

- 数据库文件 `football.db` 会在第一次运行时自动创建
- 所有数据都持久化在本地SQLite数据库中
- 爬虫模块目前使用模拟数据，可以替换为真实的API调用

## License

MIT
