# Football App - 故障排查指南

## 🔍 快速诊断

如果应用无法启动或运行异常，首先运行诊断脚本：

```bash
./diagnose.sh
```

## 常见问题及解决方案

### 问题1: 后端容器立即退出

**症状**:
```bash
docker exec -it football-backend npx prisma studio
Error response from daemon: container ... is not running
```

**诊断步骤**:

1. **查看容器状态**:
```bash
docker-compose ps
```

如果 backend 容器显示 "Exited"，说明容器启动后立即崩溃。

2. **查看完整的后端日志**:
```bash
docker logs football-backend
```

3. **查看数据库日志**:
```bash
docker logs football-postgres
```

**常见原因及解决方案**:

#### 原因A: 数据库未就绪
**错误日志**:
```
❌ 数据库连接失败，已达最大重试次数
```

**解决方案**:
```bash
# 1. 检查数据库容器状态
docker-compose ps postgres

# 2. 如果数据库未运行，重启
docker-compose restart postgres

# 3. 等待15秒后重启后端
sleep 15
docker-compose restart backend
```

#### 原因B: 迁移失败
**错误日志**:
```
Error: Migration failed
```

**解决方案**:
```bash
# 方案1: 完全重置（会删除所有数据）
docker-compose down -v
docker-compose up -d --build

# 方案2: 手动运行迁移
docker exec -it football-backend npx prisma migrate reset --force
docker-compose restart backend
```

#### 原因C: TypeScript编译错误
**错误日志**:
```
TSError: Unable to compile TypeScript
```

**解决方案**:
```bash
# 重新构建镜像
docker-compose down
docker-compose up -d --build
```

#### 原因D: 环境变量缺失
**错误日志**:
```
DATABASE_URL: 未设置
```

**解决方案**:
```bash
# 检查 .env 文件是否存在
ls backend/.env

# 如果不存在，创建它
cat > backend/.env << 'EOF'
DATABASE_URL="postgresql://football:football123@postgres:5432/footballdb?schema=public"
NODE_ENV=development
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
EOF

# 重启容器
docker-compose restart backend
```

### 问题2: API 返回 500 错误

**症状**:
```
GET http://localhost:3000/api/teams 500 (Internal Server Error)
```

**诊断步骤**:

1. **检查后端日志**:
```bash
docker logs -f football-backend
```

2. **测试健康检查**:
```bash
curl http://localhost:3000/api/health
```

**常见原因及解决方案**:

#### 原因A: 数据库表不存在
**错误日志**:
```
Error: Table 'Team' does not exist
```

**解决方案**:
```bash
# 运行迁移
docker exec -it football-backend npx prisma migrate deploy

# 或者重置数据库
docker exec -it football-backend npx prisma migrate reset --force

# 重启后端
docker-compose restart backend
```

#### 原因B: 数据库连接丢失
**错误日志**:
```
Error: Connection terminated unexpectedly
```

**解决方案**:
```bash
# 重启数据库和后端
docker-compose restart postgres
sleep 10
docker-compose restart backend
```

### 问题3: 前端显示空白或加载失败

**症状**:
- 前端页面显示空白
- 控制台显示大量网络错误

**诊断步骤**:

1. **检查前端容器日志**:
```bash
docker logs -f football-frontend
```

2. **检查后端是否响应**:
```bash
curl http://localhost:3000/api/health
```

**解决方案**:

```bash
# 1. 重启前端
docker-compose restart frontend

# 2. 如果后端也有问题，完全重启
./restart.sh
```

### 问题4: 端口已被占用

**症状**:
```
Error: bind: address already in use
```

**解决方案**:

```bash
# 查找占用端口的进程
# 对于端口 3000 (后端):
lsof -i :3000
# 或
netstat -tulpn | grep 3000

# 对于端口 5173 (前端):
lsof -i :5173

# 杀死占用端口的进程
kill -9 <PID>

# 或者修改 docker-compose.yml 中的端口映射
```

### 问题5: Docker 构建失败

**症状**:
```
ERROR [backend internal] load metadata for docker.io/library/node:20-slim
```

**解决方案**:

```bash
# 1. 检查网络连接
ping docker.io

# 2. 清理 Docker 缓存
docker system prune -a

# 3. 重新构建
docker-compose build --no-cache
docker-compose up -d
```

## 🔧 完全重置步骤

如果以上方法都无法解决问题，可以尝试完全重置：

```bash
# 1. 停止所有容器并删除卷
docker-compose down -v

# 2. 删除所有相关镜像
docker images | grep football | awk '{print $3}' | xargs docker rmi -f

# 3. 清理 Docker 系统
docker system prune -af --volumes

# 4. 重新构建和启动
docker-compose up -d --build

# 5. 等待30秒
sleep 30

# 6. 检查日志
docker logs -f football-backend
```

## 📊 验证应用正常运行

运行以下命令验证所有组件正常工作：

```bash
# 1. 检查容器状态（所有容器应该是 "Up"）
docker-compose ps

# 2. 测试后端健康检查
curl http://localhost:3000/api/health

# 3. 测试数据 API
curl http://localhost:3000/api/teams
curl http://localhost:3000/api/matches
curl http://localhost:3000/api/news

# 4. 访问前端
# 在浏览器打开: http://localhost:5173

# 5. 检查数据库
docker exec -it football-backend npx prisma studio
# 然后访问 http://localhost:5555
```

## 🆘 获取更多帮助

如果问题仍然无法解决：

1. **收集诊断信息**:
```bash
./diagnose.sh > diagnosis.txt
```

2. **检查日志**:
```bash
docker logs football-backend > backend.log 2>&1
docker logs football-postgres > postgres.log 2>&1
docker logs football-frontend > frontend.log 2>&1
```

3. **检查系统资源**:
```bash
docker stats --no-stream
```

4. **提供以下信息**:
   - 操作系统和版本
   - Docker 版本 (`docker --version`)
   - Docker Compose 版本 (`docker-compose --version`)
   - 错误日志
   - 运行的命令

## 📝 日常维护

### 查看实时日志
```bash
# 所有服务
docker-compose logs -f

# 仅后端
docker logs -f football-backend

# 仅前端
docker logs -f football-frontend

# 仅数据库
docker logs -f football-postgres
```

### 重启单个服务
```bash
docker-compose restart backend
docker-compose restart frontend
docker-compose restart postgres
```

### 查看数据库
```bash
# 使用 Prisma Studio（图形界面）
docker exec -it football-backend npx prisma studio

# 使用 psql（命令行）
docker exec -it football-postgres psql -U football -d footballdb
```

### 备份数据库
```bash
# 导出数据
docker exec football-postgres pg_dump -U football footballdb > backup.sql

# 恢复数据
docker exec -i football-postgres psql -U football footballdb < backup.sql
```

## ⚙️ 性能优化

### 如果应用运行缓慢

1. **增加 Docker 资源限制**（在 Docker Desktop 设置中）:
   - CPU: 至少 2 核
   - 内存: 至少 4 GB

2. **清理未使用的资源**:
```bash
docker system prune -af
```

3. **检查容器资源使用**:
```bash
docker stats
```

## 🔐 安全检查

### 生产环境部署前

1. **修改默认密码**:
   - 编辑 `docker-compose.yml` 中的 `POSTGRES_PASSWORD`
   - 编辑 `backend/.env` 中的 `JWT_SECRET`

2. **使用环境变量**:
   - 不要在代码中硬编码密码
   - 使用 `.env` 文件管理敏感信息

3. **启用 HTTPS**:
   - 使用反向代理（如 Nginx）
   - 配置 SSL 证书

4. **限制网络访问**:
   - 使用防火墙规则
   - 仅暴露必要的端口
