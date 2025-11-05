# 前端应用

## Web 开发模式

```bash
npm install
npm run dev
```

访问 http://localhost:5173

**注意**: Web 开发模式下不需要安装 Capacitor 依赖。

## Android 构建模式

### 首次构建

```bash
# 1. 安装 Capacitor 依赖
npm run android:install

# 2. 初始化 Android 项目
npm run android:add

# 3. 构建并同步
npm run android:build

# 4. 打开 Android Studio
npm run android:open
```

### 后续构建

```bash
# 只需运行
npm run android:build
```

或使用项目根目录的自动化脚本：

```bash
cd ..
./build-android.sh
```

## 关键说明

- **Web 开发**: 不依赖 Capacitor，快速开发
- **Android 构建**: 运行 `npm run android:install` 后才能构建 APK
- **为什么分离**: 避免 Web 开发时加载不必要的原生依赖

## 常见问题

**Q: 为什么不在 package.json 中直接包含 Capacitor？**

A: 为了让 Web 开发更轻量快速，只在需要构建 Android 时才安装原生依赖。

**Q: 运行 `npm install` 后能直接构建 Android 吗？**

A: 不能，需要先运行 `npm run android:install` 安装 Capacitor 依赖。
