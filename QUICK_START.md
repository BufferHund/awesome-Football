# Football App - 快速启动指南

## 🚀 快速启动

### 方式1: 使用启动脚本（推荐）

```bash
# 运行重启脚本
./restart.sh
```

### 方式2: 手动启动

```bash
# 1. 停止所有容器（删除数据卷）
docker-compose down -v

# 2. 重新构建并启动
docker-compose up -d --build

# 3. 查看后端日志
docker logs -f football-backend

# 4. 等待看到以下日志：
#    ✅ Database initialized successfully
#    🚀 Server running on port 3000
```

## 📋 启动流程

应用启动时会自动：

1. ✅ 启动 PostgreSQL 数据库
2. ✅ 运行数据库迁移（创建表结构）
3. ✅ 测试数据库连接（最多重试10次）
4. ✅ 填充种子数据：
   - 10支知名球队
   - 3场示例比赛
   - 6条足球新闻
5. ✅ 启动 HTTP 服务器（端口 3000）
6. ✅ 5秒后启动数据同步调度器

## 🔍 故障排查

### 问题1: 容器无法启动

```bash
# 查看容器日志
docker logs football-backend
docker logs football-postgres

# 查看容器状态
docker-compose ps

# 完全重置（删除所有数据）
docker-compose down -v
docker system prune -f
docker-compose up -d --build
```

### 问题2: 数据库连接失败

```bash
# 检查数据库是否运行
docker-compose ps postgres

# 重启数据库
docker-compose restart postgres

# 等待15秒后重启后端
sleep 15
docker-compose restart backend
```

### 问题3: 前端显示500错误

```bash
# 检查后端是否正常运行
curl http://localhost:3000/api/health

# 检查数据库是否有数据
docker exec -it football-backend npx prisma studio

# 或者直接查询
curl http://localhost:3000/api/teams
curl http://localhost:3000/api/matches
curl http://localhost:3000/api/news
```

## 🌐 访问应用

- **前端**: http://localhost:5173
- **后端API**: http://localhost:3000
- **数据库管理**: 运行 `docker exec -it football-backend npx prisma studio`，然后访问 http://localhost:5555
- **API文档/调试**: http://localhost:5173/api-docs

## 📊 验证数据

启动成功后，应该看到：

```bash
# 测试Teams API
curl http://localhost:3000/api/teams
# 应该返回10支球队的JSON数据

# 测试Matches API
curl http://localhost:3000/api/matches
# 应该返回3场比赛的JSON数据

# 测试News API
curl http://localhost:3000/api/news
# 应该返回6条新闻的JSON数据
```

## 🔧 开发命令

```bash
# 查看所有容器状态
docker-compose ps

# 查看后端日志（实时）
docker logs -f football-backend

# 查看前端日志（实时）
docker logs -f football-frontend

# 进入后端容器
docker exec -it football-backend sh

# 进入数据库
docker exec -it football-postgres psql -U football -d footballdb

# 重启单个服务
docker-compose restart backend
docker-compose restart frontend

# 停止所有服务
docker-compose down

# 停止并删除数据
docker-compose down -v
```

## 🎯 预期启动时间

- 数据库启动: ~5秒
- 数据库迁移: ~2秒
- 种子数据填充: ~3秒
- 后端服务启动: ~2秒
- **总计**: < 15秒

## ⚠️ 注意事项

1. **首次启动**: 第一次启动时Docker需要下载镜像，可能需要几分钟
2. **端口占用**: 确保3000（后端）和5173（前端）端口未被占用
3. **数据持久化**: 数据存储在Docker volume中，`docker-compose down -v` 会删除所有数据
4. **数据同步**: 启动后5秒会自动触发数据同步（如果 ENABLE_AUTO_SYNC=true）

## 🔑 用户认证

注册新用户：
1. 访问 http://localhost:5173/login
2. 切换到"注册"标签
3. 输入用户名、邮箱、密码
4. 注册成功后自动登录

验证邮箱：
1. 登录后访问个人中心 http://localhost:5173/profile
2. 点击"验证邮箱"按钮
3. 复制验证链接（开发环境会直接显示）
4. 访问验证链接完成验证

## 📝 功能权限

- **未注册用户**: 可以浏览所有内容
- **已注册但未验证邮箱**: 可以浏览，不能发帖、购买会员
- **已验证邮箱**: 完整功能（发帖、购买会员）
- **会员用户**: 右上角显示黑色VIP标志

## 🆘 获取帮助

如果遇到问题：
1. 运行 `./diagnose.sh` 查看诊断信息
2. 查看 `docker logs football-backend` 获取详细错误
3. 检查 `docker-compose ps` 确认所有容器都在运行
4. 运行 `./restart.sh` 完全重启应用
5. 查看 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) 获取详细故障排查指南
