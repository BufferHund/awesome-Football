# Football App - Mobile (React Native)

足球应用移动端 - 使用 React Native 和 Expo 构建

## 技术栈

- **React Native** - 跨平台移动应用框架
- **Expo** - React Native 开发平台
- **TypeScript** - 类型安全
- **React Navigation** - 导航管理
- **Axios** - HTTP 客户端

## 功能特性

- 📱 **首页** - 直播比赛和最新新闻
- ⚽ **比赛** - 今日比赛列表，实时比分
- 🏆 **球队** - 球队信息，搜索功能
- 📰 **新闻** - 足球新闻资讯
- 💬 **论坛** - 球迷讨论社区

## 项目结构

```
mobile/
├── App.tsx                          # 应用入口
├── src/
│   ├── navigation/
│   │   └── BottomTabNavigator.tsx   # 底部导航栏
│   ├── screens/
│   │   ├── HomeScreen.tsx           # 首页
│   │   ├── MatchesScreen.tsx        # 比赛列表
│   │   ├── TeamsScreen.tsx          # 球队列表
│   │   ├── NewsScreen.tsx           # 新闻列表
│   │   └── ForumScreen.tsx          # 论坛列表
│   ├── services/
│   │   └── api.ts                   # API 服务
│   └── types/
│       └── index.ts                 # TypeScript 类型定义
├── package.json
└── tsconfig.json
```

## 开发环境要求

- Node.js 16+
- npm 或 yarn
- Expo CLI (自动安装)
- Android Studio (Android 开发) 或 Xcode (iOS 开发)

## 安装依赖

```bash
cd mobile
npm install
```

## 运行应用

### 使用 Expo Go (推荐用于开发)

1. 在手机上安装 Expo Go 应用
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. 启动开发服务器：

```bash
npm start
```

3. 用手机扫描终端显示的二维码

### Android 模拟器

```bash
npm run android
```

### iOS 模拟器 (仅限 macOS)

```bash
npm run ios
```

## API 配置

默认 API 地址配置在 `src/services/api.ts`:

- **开发环境 (Android 模拟器)**: `http://10.0.2.2:3000/api`
- **开发环境 (iOS 模拟器)**: `http://localhost:3000/api`
- **生产环境**: 需要配置实际的 API 地址

如需修改 API 地址，编辑 `src/services/api.ts` 中的 `API_BASE_URL` 常量。

## 构建生产版本

### Android APK

```bash
npm run build:android
```

### iOS IPA (需要 macOS 和 Apple 开发者账号)

```bash
npm run build:ios
```

## 开发说明

### 添加新页面

1. 在 `src/screens/` 创建新的屏幕组件
2. 在 `src/navigation/BottomTabNavigator.tsx` 添加导航配置
3. 更新 TypeScript 类型定义

### API 服务

所有 API 调用统一在 `src/services/api.ts` 中管理：

```typescript
import { matchService, newsService, teamService } from '../services/api';

// 获取比赛数据
const matches = await matchService.getTodayMatches();

// 获取新闻数据
const news = await newsService.getAllNews();
```

### 错误处理

所有 API 调用都包含错误处理，失败时返回空数组：

```typescript
const data = await matchService.getTodayMatches().catch(() => []);
```

## 主要依赖

- `@react-navigation/native` - 导航核心
- `@react-navigation/bottom-tabs` - 底部导航
- `@react-navigation/stack` - 堆栈导航
- `react-native-safe-area-context` - 安全区域处理
- `react-native-screens` - 原生屏幕优化
- `axios` - HTTP 请求
- `@expo/vector-icons` - 图标库

## 调试

使用 Chrome DevTools 调试：

1. 启动应用后，按 `d` 键打开开发菜单
2. 选择 "Debug remote JS"
3. 在浏览器中打开 `http://localhost:19000/debugger-ui`

## 注意事项

- Android 模拟器使用 `10.0.2.2` 访问本机 localhost
- iOS 模拟器可以直接使用 `localhost`
- 真机调试需要确保设备和开发机在同一网络
- 生产构建需要配置正确的 API 域名

## 问题排查

### 无法连接到后端 API

- 确认后端服务正在运行 (默认端口 3000)
- 检查 `src/services/api.ts` 中的 API 地址配置
- Android 模拟器使用 `10.0.2.2` 而不是 `localhost`

### Metro bundler 端口冲突

```bash
# 清理缓存并重启
npm start -- --reset-cache
```

### 依赖安装问题

```bash
# 删除 node_modules 和重新安装
rm -rf node_modules
npm install
```

## 更多资源

- [Expo 文档](https://docs.expo.dev/)
- [React Native 文档](https://reactnative.dev/)
- [React Navigation 文档](https://reactnavigation.org/)
