# ⚽ 足球世界 - Football App

一个现代化的全栈足球资讯应用，对标懂球帝和直播吧。提供实时比分、赛事资讯、球队信息、积分榜等功能。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![React](https://img.shields.io/badge/React-18.2-61dafb)
![Node](https://img.shields.io/badge/Node-20-green)

## ✨ 功能特性

- 📊 **实时比分** - 查看正在进行的比赛实时比分
- 📅 **赛程表** - 浏览今日、本周、全部赛事
- 🏆 **积分榜** - 各大联赛积分排名，支持多联赛切换
- ⚽ **球队信息** - 详细的球队资料、球员名单
- 📰 **新闻资讯** - 最新足球新闻、转会消息、赛事报道
- 🎨 **现代化UI** - 响应式设计，支持移动端和桌面端
- 🚀 **高性能** - 基于Vite构建，快速加载

## 🛠️ 技术栈

### 前端
- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: TailwindCSS
- **路由**: React Router v6
- **HTTP客户端**: Axios
- **图标**: Lucide React

### 后端
- **运行时**: Node.js 20
- **框架**: Express + TypeScript
- **ORM**: Prisma
- **数据库**: PostgreSQL 16
- **安全**: Helmet, CORS

### 部署
- **容器化**: Docker + Docker Compose
- **反向代理**: Vite Dev Proxy

## 📦 快速开始

### 前置要求

- Docker 和 Docker Compose
- Node.js 20+ (本地开发可选)

### 使用 Docker (推荐)

1. **克隆项目**
```bash
git clone <repository-url>
cd awesome-Football
```

2. **启动所有服务**
```bash
docker-compose up -d
```

这将启动三个服务：
- PostgreSQL 数据库 (端口 5432)
- 后端 API (端口 3000)
- 前端应用 (端口 5173)

3. **访问应用**
- 前端: http://localhost:5173
- 后端API: http://localhost:3000
- API文档: http://localhost:3000/

4. **查看日志**
```bash
# 查看所有服务日志
docker-compose logs -f

# 查看特定服务
docker-compose logs -f backend
docker-compose logs -f frontend
```

5. **停止服务**
```bash
docker-compose down

# 同时删除数据卷
docker-compose down -v
```

### 本地开发

#### 后端

```bash
cd backend

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env

# 生成Prisma客户端
npm run prisma:generate

# 运行数据库迁移
npm run prisma:migrate

# 填充示例数据
npm run prisma:seed

# 启动开发服务器
npm run dev
```

#### 前端

```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 📁 项目结构

```
awesome-Football/
├── backend/                 # 后端服务
│   ├── src/
│   │   ├── routes/         # API路由
│   │   ├── controllers/    # 控制器
│   │   ├── services/       # 业务逻辑
│   │   ├── types/          # TypeScript类型
│   │   └── index.ts        # 入口文件
│   ├── prisma/
│   │   ├── schema.prisma   # 数据库模型
│   │   └── seed.ts         # 种子数据
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
│
├── frontend/               # 前端应用
│   ├── src/
│   │   ├── components/    # React组件
│   │   ├── pages/         # 页面组件
│   │   ├── services/      # API服务
│   │   ├── types/         # TypeScript类型
│   │   ├── App.tsx        # 应用根组件
│   │   ├── main.tsx       # 入口文件
│   │   └── index.css      # 全局样式
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── Dockerfile
│
├── docker-compose.yml     # Docker编排配置
└── README.md             # 项目文档
```

## 🔌 API 端点

### 比赛 (Matches)
- `GET /api/matches` - 获取所有比赛
- `GET /api/matches/:id` - 获取比赛详情
- `GET /api/matches/today/list` - 获取今日比赛
- `GET /api/matches/live/now` - 获取直播中的比赛

### 球队 (Teams)
- `GET /api/teams` - 获取所有球队
- `GET /api/teams/:id` - 获取球队详情（包含球员）

### 球员 (Players)
- `GET /api/players` - 获取所有球员
- `GET /api/players/:id` - 获取球员详情

### 积分榜 (Standings)
- `GET /api/standings?competition=英超` - 获取指定联赛积分榜
- `GET /api/standings/competitions/list` - 获取所有联赛列表

### 新闻 (News)
- `GET /api/news` - 获取新闻列表
- `GET /api/news/:id` - 获取新闻详情

## 📊 数据库模型

应用包含以下数据模型：

- **Team** - 球队信息
- **Player** - 球员信息
- **Match** - 比赛信息
- **MatchEvent** - 比赛事件（进球、黄牌等）
- **Standing** - 积分榜
- **News** - 新闻资讯

详见 `backend/prisma/schema.prisma`

## 🎨 页面截图

### 首页
- 直播中的比赛
- 今日赛事
- 最新新闻
- 快速导航

### 比赛页面
- 比赛列表
- 实时比分
- 比赛详情
- 比赛事件

### 积分榜
- 多联赛切换
- 排名、积分、胜负场次
- 近期状态

### 球队页面
- 球队列表
- 球队详情
- 球员名单

### 新闻页面
- 新闻列表
- 新闻详情
- 浏览统计

## 🚀 部署

### 生产环境构建

#### 前端
```bash
cd frontend
npm run build
```

构建产物位于 `frontend/dist`

#### 后端
```bash
cd backend
npm run build
```

构建产物位于 `backend/dist`

### Docker 生产部署

修改 `docker-compose.yml` 中的环境变量，然后：

```bash
docker-compose up -d
```

## 🔧 配置

### 环境变量

#### 后端 (.env)
```env
DATABASE_URL=postgresql://football:football123@postgres:5432/footballdb
PORT=3000
NODE_ENV=production
```

#### 前端
在 `vite.config.ts` 中配置API代理。

## 🤝 贡献

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📝 待办事项

- [ ] 添加用户认证和个人中心
- [ ] 实现实时推送（WebSocket）
- [ ] 添加更多数据可视化图表
- [ ] 支持多语言（国际化）
- [ ] 移动端原生应用（React Native）
- [ ] 添加视频直播功能
- [ ] 集成真实足球数据API

## 📄 许可证

本项目采用 MIT 许可证。

## 🙏 致谢

- 设计灵感来自懂球帝和直播吧
- 图标由 Lucide React 提供
- UI框架使用 TailwindCSS

## 📞 联系方式

如有问题或建议，请提交 Issue。

---

⚽ **享受足球的乐趣！** ⚽
