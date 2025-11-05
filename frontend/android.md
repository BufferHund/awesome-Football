# Android APK 构建指南

## 前置要求

1. **安装 Node.js 20+**
2. **安装 Java JDK 17**
   ```bash
   # Ubuntu/Debian
   sudo apt install openjdk-17-jdk

   # macOS
   brew install openjdk@17
   ```

3. **安装 Android Studio**
   - 下载: https://developer.android.com/studio
   - 安装 Android SDK (API 33+)
   - 配置环境变量:
     ```bash
     export ANDROID_HOME=$HOME/Android/Sdk
     export PATH=$PATH:$ANDROID_HOME/platform-tools
     export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
     ```

## 快速开始

### 1. 初始化 Capacitor (首次)

```bash
cd frontend

# 安装依赖
npm install

# 初始化 Capacitor（如果还没有android文件夹）
npm run cap:add
```

### 2. 构建 Web 应用

```bash
# 构建生产版本
npm run build
```

### 3. 同步到 Android

```bash
# 同步Web资源到Android项目
npm run cap:sync
```

### 4. 在 Android Studio 中打开

```bash
# 打开Android项目
npm run android:open
```

### 5. 构建 APK

在 Android Studio 中:
1. 点击 `Build` -> `Build Bundle(s) / APK(s)` -> `Build APK(s)`
2. 等待构建完成
3. APK位置: `android/app/build/outputs/apk/debug/app-debug.apk`

## 一键构建脚本

```bash
# 从Web构建到Android同步
npm run android:build
```

## 签名 APK (生产环境)

### 1. 生成密钥库

```bash
keytool -genkey -v -keystore my-release-key.keystore \
  -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

### 2. 配置 Gradle

编辑 `android/app/build.gradle`:

```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file('my-release-key.keystore')
            storePassword 'your-password'
            keyAlias 'my-key-alias'
            keyPassword 'your-password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

### 3. 构建签名 APK

```bash
cd android
./gradlew assembleRelease
```

APK位置: `android/app/build/outputs/apk/release/app-release.apk`

## 配置应用图标

1. 准备图标 (1024x1024 PNG)
2. 使用在线工具生成: https://icon.kitchen
3. 下载资源包
4. 替换 `android/app/src/main/res/` 中的图标文件

## 配置启动画面

1. 准备启动图 (2732x2732 PNG)
2. 放置到 `android/app/src/main/res/drawable/splash.png`
3. 在 `capacitor.config.ts` 中配置

## 配置 API URL

### 开发环境

在 `capacitor.config.ts` 中:
```typescript
server: {
  url: 'http://YOUR_LOCAL_IP:5173',
  cleartext: true
}
```

### 生产环境

在 `frontend/vite.config.ts` 中配置API代理或直接使用生产API URL。

## 测试 APK

```bash
# 安装到连接的设备
adb install android/app/build/outputs/apk/debug/app-debug.apk

# 或通过Android Studio的Run按钮
```

## 常见问题

### 1. Gradle 构建失败

```bash
cd android
./gradlew clean
./gradlew build
```

### 2. Android SDK 路径问题

确保环境变量正确:
```bash
echo $ANDROID_HOME
```

### 3. 权限问题

在 `android/app/src/main/AndroidManifest.xml` 中添加:
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

## 发布到 Google Play

1. 构建签名的release APK
2. 创建Google Play开发者账号 ($25一次性费用)
3. 在Play Console中创建应用
4. 上传APK
5. 填写应用信息、截图等
6. 提交审核

## 性能优化

1. **启用代码混淆** (proguard)
2. **压缩资源**
3. **使用 WebP 格式图片**
4. **启用 HTTP/2**
5. **实现离线缓存**

## 更新应用

1. 修改 `package.json` 中的版本号
2. 更新 `android/app/build.gradle` 中的 `versionCode` 和 `versionName`
3. 重新构建APK
4. 发布新版本

---

📱 祝你构建成功！
