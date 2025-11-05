# ⚡ 快速开始指南

## 🎯 三种使用方式

### 1️⃣ Docker 一键启动 (推荐新手)

```bash
# 克隆项目
git clone <repo-url>
cd awesome-Football

# 启动所有服务
docker-compose up -d

# 访问应用
# 前端: http://localhost:5173
# 后端: http://localhost:3000
```

✅ 自动启动PostgreSQL、后端API、前端
✅ 自动创建示例数据
✅ 无需配置环境

---

### 2️⃣ 使用真实足球数据

#### Step 1: 获取免费API Key

1. 访问 https://www.api-football.com/
2. 注册账号（免费）
3. 复制API Key

#### Step 2: 配置环境

```bash
cd backend
cp .env.example .env

# 编辑 .env 文件
nano .env

# 添加你的API Key
FOOTBALL_API_KEY=your-api-key-here
ENABLE_AUTO_SYNC=true
```

#### Step 3: 重启服务

```bash
docker-compose restart backend
```

#### Step 4: 触发数据同步

```bash
# 同步今日比赛
curl -X POST http://localhost:3000/api/sync/matches/today

# 同步英超积分榜
curl -X POST http://localhost:3000/api/sync/standings/premier-league

# 同步西甲积分榜
curl -X POST http://localhost:3000/api/sync/standings/la-liga
```

✅ 自动每5分钟更新直播比赛
✅ 自动每小时更新今日比赛
✅ 自动每天凌晨2点更新积分榜

#### 备选：使用爬虫（无需API Key）

```bash
# Google比分
curl http://localhost:3000/api/sync/scrape/google

# FlashScore
curl http://localhost:3000/api/sync/scrape/flashscore

# ESPN
curl http://localhost:3000/api/sync/scrape/espn
```

---

### 3️⃣ 构建 Android APK

#### 快速构建（自动化脚本）

```bash
./build-android.sh
```

APK位置: `frontend/android/app/build/outputs/apk/debug/app-debug.apk`

#### 手动构建

**前置要求：**
- Node.js 20+
- Java JDK 17+
- Android Studio (包含Android SDK)

**构建步骤：**

```bash
cd frontend

# 1. 安装依赖
npm install

# 2. 初始化Android (首次)
npm run cap:add

# 3. 构建Web应用
npm run build

# 4. 同步到Android
npm run cap:sync

# 5. 打开Android Studio
npm run android:open

# 在Android Studio中:
# Build -> Build Bundle(s) / APK(s) -> Build APK(s)
```

---

## 📱 测试APK

### 使用模拟器

1. 在Android Studio中打开AVD Manager
2. 创建或启动模拟器
3. 点击Run按钮

### 使用真机

```bash
# 连接手机并开启USB调试
adb devices

# 安装APK
adb install frontend/android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🎨 自定义配置

### 修改应用名称和图标

1. **应用名称**
   编辑 `frontend/capacitor.config.ts`:
   ```typescript
   appName: '你的App名称',
   ```

2. **应用ID**
   ```typescript
   appId: 'com.yourcompany.app',
   ```

3. **应用图标**
   - 准备1024x1024图标
   - 使用 https://icon.kitchen 生成
   - 替换 `frontend/android/app/src/main/res/` 中的图标

4. **启动画面**
   编辑 `frontend/capacitor.config.ts`:
   ```typescript
   SplashScreen: {
     backgroundColor: '#your-color',
   },
   ```

---

## 🐛 常见问题

### Docker问题

**Q: 端口被占用**
```bash
# 修改docker-compose.yml中的端口
ports:
  - "8080:5173"  # 将5173改为其他端口
```

**Q: 权限错误**
```bash
sudo docker-compose up -d
```

### Android构建问题

**Q: Gradle构建失败**
```bash
cd frontend/android
./gradlew clean
./gradlew build
```

**Q: Android SDK路径问题**
```bash
# 设置环境变量
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

**Q: 签名问题**
生产环境需要签名APK，查看 `frontend/android.md`

### API问题

**Q: API配额用完**
使用爬虫功能或等待第二天重置

**Q: 数据不同步**
检查日志: `docker-compose logs backend`

---

## 📚 更多资源

- [完整README](./README.md) - 详细功能说明
- [API使用指南](./API_GUIDE.md) - 数据源配置
- [Android构建指南](./frontend/android.md) - 详细构建教程

---

## 🎯 下一步

1. ✅ 启动应用并浏览功能
2. ✅ 配置真实数据API
3. ✅ 构建Android APK
4. ✅ 自定义品牌和样式
5. ✅ 部署到生产环境
6. ✅ 发布到应用商店

---

## 💡 提示

- 免费API每天100次请求，合理使用
- Android首次构建需要下载依赖，耐心等待
- 爬虫功能可能不稳定，优先使用API
- 生产环境记得配置签名APK

---

🚀 **开始你的足球App之旅吧！**
