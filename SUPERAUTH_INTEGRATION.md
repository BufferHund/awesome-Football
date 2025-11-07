# SuperAuth 统一认证集成指南

本文档说明如何将足球应用与SuperAuth统一身份认证平台集成。

## 📋 目录

- [功能特性](#功能特性)
- [认证模式](#认证模式)
- [快速开始](#快速开始)
- [环境配置](#环境配置)
- [Docker部署](#docker部署)
- [API文档](#api文档)
- [前端集成](#前端集成)
- [故障排除](#故障排除)

## ✨ 功能特性

### 双模式认证

本应用支持两种登录方式，用户可自由选择：

#### 1. 内置登录（推荐）⭐
- **特点**：在应用内直接输入用户名密码
- **优势**：快速便捷，无需页面跳转
- **适用**：一般用户，日常使用
- **实现**：Direct API模式

#### 2. 统一账号登录（SSO）
- **特点**：重定向到SuperAuth Portal统一登录
- **优势**：最高安全性，一次登录全平台通用
- **适用**：企业环境，多应用场景
- **实现**：Portal重定向模式

### 认证功能

- ✅ 用户注册（两种方式）
- ✅ 用户登录（两种方式）
- ✅ 自动登录（注册后）
- ✅ Token验证
- ✅ Session管理
- ✅ 登出功能
- ✅ 虚拟用户支持

## 🎯 认证模式

### Direct API模式（默认）

```
用户 → 应用前端 → 应用后端 → SuperAuth Gateway
         ↓            ↓              ↓
      显示表单    转发请求      验证并返回Token
         ↓            ↓              ↓
      提交数据    转发Cookie   ← ── ─┘
         └─────────  完成认证
```

**工作流程**：
1. 用户在应用页面填写用户名密码
2. 前端提交到应用后端 `/api/auth/login`
3. 后端转发到Gateway `/api/auth/login`
4. Gateway验证并返回Token和Set-Cookie
5. 应用后端转发Cookie给前端
6. 用户自动登录

### Portal重定向模式（SSO）

```
用户 → 应用前端 → SuperAuth Portal → SuperAuth Gateway
         ↓              ↓                    ↓
      点击登录      显示登录页          验证并返回Token
         ↓              ↓                    ↓
      重定向        提交密码            设置Cookie
         ↓              ↓                    ↓
      返回应用   ← ──  重定向回应用（带Token）
         └─────────  完成认证
```

**工作流程**：
1. 用户点击"统一账号登录"
2. 重定向到Portal登录页
3. 在Portal完成登录
4. 返回应用并自动认证

## 🚀 快速开始

### 前置条件

1. **已部署SuperAuth**：
   ```bash
   # 克隆SuperAuth仓库
   git clone https://github.com/BufferHund/SuperAuth.git
   cd SuperAuth

   # 启动SuperAuth服务
   ./start-everything.sh
   ```

2. **创建共享网络**：
   ```bash
   docker network create superauth-network
   ```

### 方式一：使用docker-compose（推荐）

```bash
# 1. 进入项目目录
cd awesome-Football

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，设置：
# GATEWAY_URL=http://gateway:4000
# PORTAL_URL=http://localhost

# 3. 使用SuperAuth集成配置启动
docker-compose -f docker-compose.superauth.yml up -d

# 4. 查看日志
docker-compose -f docker-compose.superauth.yml logs -f
```

### 方式二：本地开发

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
export GATEWAY_URL=http://localhost:4000
export PORTAL_URL=http://localhost

# 3. 启动开发服务器
npm run dev

# 应用将在 http://localhost:2000 运行
```

## ⚙️ 环境配置

### 环境变量

创建 `.env` 文件：

```bash
# 应用端口
PORT=2000

# SuperAuth Gateway URL
# Docker内网使用服务名
GATEWAY_URL=http://gateway:4000

# SuperAuth Portal URL
# 用于重定向登录
PORTAL_URL=http://localhost
```

### Docker网络配置

#### 选项1：加入SuperAuth网络（推荐）

修改 `docker-compose.yml`：

```yaml
services:
  football-app:
    # ... 其他配置 ...
    networks:
      - superauth-network  # 加入SuperAuth网络
    environment:
      - GATEWAY_URL=http://gateway:4000
      - PORTAL_URL=http://localhost

networks:
  superauth-network:
    external: true  # 使用外部网络
```

#### 选项2：使用独立网络

保持默认配置，通过端口访问：

```yaml
environment:
  - GATEWAY_URL=http://localhost:4000  # 通过宿主机端口
  - PORTAL_URL=http://localhost
```

## 🐳 Docker部署

### 完整部署流程

```bash
# 1. 确保SuperAuth运行中
cd /path/to/SuperAuth
docker-compose ps  # 检查Gateway和Portal是否运行

# 2. 创建共享网络（如果未创建）
docker network create superauth-network

# 3. 部署足球应用
cd /path/to/awesome-Football

# 构建镜像
docker-compose -f docker-compose.superauth.yml build

# 启动服务
docker-compose -f docker-compose.superauth.yml up -d

# 4. 验证连接
docker exec awesome-football-superauth wget -O- http://gateway:4000/health
```

### 验证部署

```bash
# 检查应用状态
curl http://localhost:2000/health

# 检查认证端点
curl http://localhost:2000/api

# 测试登录（使用SuperAuth测试账号）
curl -X POST http://localhost:2000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  -c cookies.txt -v
```

## 📡 API文档

### 认证API

#### 1. 用户登录（Direct API）

```bash
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}

# 成功响应
{
  "success": true,
  "message": "登录成功",
  "user": {
    "userId": "user_001",
    "username": "admin",
    "email": "admin@example.com",
    "isVirtual": false,
    "isAuthenticated": true
  }
}
```

#### 2. 用户注册（Direct API）

```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "newuser",
  "email": "user@example.com",
  "password": "password123"
}

# 成功响应
{
  "success": true,
  "message": "注册成功",
  "user": { ... }
}
```

#### 3. 获取Portal登录URL（Portal模式）

```bash
GET /api/auth/portal-login?return=http://localhost:2000/

# 响应
{
  "success": true,
  "portalUrl": "http://localhost/?redirect=http%3A%2F%2Flocalhost%3A2000%2F"
}
```

#### 4. 获取当前用户

```bash
GET /api/auth/me
Cookie: auth_token=<token>

# 响应
{
  "success": true,
  "authenticated": true,
  "user": { ... }
}
```

#### 5. 登出

```bash
POST /api/auth/logout
Cookie: auth_token=<token>

# 响应
{
  "success": true,
  "message": "登出成功"
}
```

### 受保护的API

以下API需要认证：

- `POST /api/teams` - 创建球队（需要管理员）
- `POST /api/players` - 创建球员（需要管理员）
- `POST /api/matches` - 创建比赛（需要管理员）
- `POST /api/products` - 创建商品（需要管理员）
- `POST /api/bets` - 创建投注（需要真实用户）
- `GET /api/bets/user/:userId` - 查看投注（需要登录）

## 🌐 前端集成

### 使用认证库

应用提供了 `auth.js` 工具库：

```javascript
// 检查认证状态
const user = await checkAuth();
if (user) {
  console.log('已登录:', user.username);
}

// Direct API登录
const result = await login(username, password);
if (result.success) {
  window.location.href = '/';
}

// Direct API注册
const result = await register(username, email, password);

// 登出
await logout();

// 获取Portal登录URL
const portalUrl = await getPortalLoginUrl(returnUrl);
window.location.href = portalUrl;

// 要求认证（受保护页面）
const user = await requireAuth();  // 自动重定向到登录页
```

### 页面示例

#### 登录页面（双模式）

```html
<!-- Tab切换 -->
<div class="auth-tabs">
  <button class="auth-tab active" data-tab="direct">内置登录</button>
  <button class="auth-tab" data-tab="portal">统一账号登录</button>
</div>

<!-- Direct API登录表单 -->
<div id="directTab">
  <form id="loginForm">
    <input type="text" name="username" required>
    <input type="password" name="password" required>
    <button type="submit">登录</button>
  </form>
</div>

<!-- Portal重定向登录 -->
<div id="portalTab" style="display:none">
  <button id="portalLoginBtn">前往统一账号登录 →</button>
</div>

<script>
// Direct API登录
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const result = await login(username.value, password.value);
  if (result.success) {
    window.location.href = '/';
  }
});

// Portal登录
document.getElementById('portalLoginBtn').addEventListener('click', async () => {
  const response = await fetch('/api/auth/portal-login?return=' +
    encodeURIComponent(window.location.origin + '/'));
  const result = await response.json();
  if (result.success) {
    window.location.href = result.portalUrl;
  }
});
</script>
```

## 🔧 故障排除

### 问题1：无法连接Gateway

**症状**：
```
Error: getaddrinfo ENOTFOUND gateway
```

**解决方案**：
```bash
# 检查Docker网络
docker network inspect superauth-network

# 确认应用在正确的网络中
docker inspect awesome-football-superauth | grep Networks

# 重新连接网络
docker network connect superauth-network awesome-football-superauth
```

### 问题2：Cookie未设置

**症状**：登录成功但未自动认证

**解决方案**：
1. 检查应用是否正确转发Cookie：
   ```typescript
   const setCookie = response.headers['set-cookie'];
   if (setCookie) {
     res.setHeader('Set-Cookie', setCookie);
   }
   ```

2. 检查Cookie域配置：
   ```bash
   # SuperAuth的Cookie应该是：
   # Domain: localhost或.yourdomain.com
   # Path: /
   # HttpOnly: true
   ```

### 问题3：Portal重定向失败

**症状**：点击"统一账号登录"无响应

**解决方案**：
1. 检查PORTAL_URL环境变量
2. 确认SuperAuth Portal正在运行：
   ```bash
   curl http://localhost/
   ```

### 问题4：Token验证失败

**症状**：
```
{"success": false, "message": "认证已过期"}
```

**解决方案**：
1. 检查Redis是否运行（Token存储在Redis）
2. 检查Session TTL配置
3. 清除浏览器Cookie重新登录

## 📚 参考资源

- [SuperAuth文档](https://github.com/BufferHund/SuperAuth)
- [SuperAuth API文档](https://github.com/BufferHund/SuperAuth/blob/main/openapi.yaml)
- [认证模式对比](https://github.com/BufferHund/SuperAuth/blob/main/DUAL_MODE_AUTH.md)
- [集成示例](https://github.com/BufferHund/SuperAuth/tree/main/examples)

## 🤝 技术支持

如遇到问题，请：

1. 查看日志：
   ```bash
   docker logs awesome-football-superauth
   docker logs superauth-gateway
   ```

2. 使用诊断工具：
   ```bash
   cd /path/to/SuperAuth
   ./diagnose.sh
   ```

3. 提交Issue：
   - [SuperAuth Issues](https://github.com/BufferHund/SuperAuth/issues)
   - [awesome-Football Issues](https://github.com/BufferHund/awesome-Football/issues)

---

**集成完成！** 🎉

现在您的足球应用已完整集成SuperAuth统一身份认证平台。
