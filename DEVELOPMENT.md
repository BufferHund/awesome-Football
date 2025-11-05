# 开发指南

## 快速启动

### 使用 Docker Compose（推荐）

启动所有服务（数据库、后端、前端）：

```bash
docker compose up -d
```

访问应用：
- 前端：http://localhost:5173
- 后端API：http://localhost:3000
- 数据库：localhost:5432

停止服务：

```bash
docker compose down
```

### 本地开发模式

#### 1. 启动数据库

使用 Docker 启动 PostgreSQL：

```bash
docker run -d \
  --name football-postgres \
  -e POSTGRES_USER=football \
  -e POSTGRES_PASSWORD=football123 \
  -e POSTGRES_DB=footballdb \
  -p 5432:5432 \
  postgres:16-alpine
```

#### 2. 启动后端服务

```bash
cd backend

# 安装依赖
npm install

# 运行数据库迁移
npx prisma migrate dev

# 启动开发服务器
npm run dev
```

后端将在 http://localhost:3000 运行

#### 3. 启动前端服务

```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端将在 http://localhost:5173 运行

## 常见问题

### Q: 前端显示 "无法连接到后端服务" 错误

**A**: 这意味着后端服务没有运行。请确保：
1. 后端服务已启动并在端口 3000 运行
2. 数据库已启动并可以连接
3. 检查后端控制台是否有错误

### Q: API 同步功能报错 "Unexpected end of JSON input"

**A**: 这通常是因为：
1. 后端服务未启动
2. 后端 API 路由配置有问题
3. 数据库连接失败

解决方法：
- 检查后端服务是否正常运行
- 查看后端日志排查错误
- 确保数据库已正确初始化

### Q: 如何配置 API Key？

**A**:
1. 访问隐藏设置页面（点击 logo 7次）
2. 在 "API 配置" 部分输入你的 Football API Key
3. 从 https://www.api-football.com/ 获取免费 API Key

## 环境变量

### 后端 (.env)

```env
DATABASE_URL="postgresql://football:football123@localhost:5432/footballdb?schema=public"
PORT=3000
NODE_ENV=development
FOOTBALL_API_KEY=your_api_key_here
ENABLE_AUTO_SYNC=false
```

### 前端 (.env)

```env
VITE_API_URL=http://localhost:3000
```

## 数据库管理

### 查看数据库

```bash
cd backend
npx prisma studio
```

### 重置数据库

```bash
cd backend
npx prisma migrate reset
npx prisma db seed  # 如果有种子数据
```

## 构建生产版本

### 前端

```bash
cd frontend
npm run build
# 输出在 frontend/dist/
```

### 后端

```bash
cd backend
npm run build
# 输出在 backend/dist/
```

## Android APK 构建

```bash
cd frontend
./build-android.sh
```

APK 将输出到：`android/app/build/outputs/apk/debug/app-debug.apk`

## 技术栈

- **前端**: React 18 + TypeScript + Vite + TailwindCSS
- **后端**: Node.js + Express + TypeScript + Prisma
- **数据库**: PostgreSQL 16
- **移动端**: Capacitor

## 目录结构

```
awesome-Football/
├── frontend/           # React 前端应用
│   ├── src/
│   │   ├── components/ # React 组件
│   │   ├── pages/      # 页面组件
│   │   ├── services/   # API 服务
│   │   └── types/      # TypeScript 类型
│   └── vite.config.ts  # Vite 配置
├── backend/            # Node.js 后端应用
│   ├── src/
│   │   ├── routes/     # API 路由
│   │   ├── services/   # 业务逻辑
│   │   └── index.ts    # 入口文件
│   └── prisma/         # 数据库 schema
└── docker-compose.yml  # Docker 编排配置
```
