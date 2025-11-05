#!/bin/bash

# 足球App Android构建脚本
# 使用方法: ./build-android.sh [debug|release]

set -e

BUILD_TYPE=${1:-debug}

echo "🏗️  开始构建 Android APK (${BUILD_TYPE})..."

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未找到 Node.js，请先安装 Node.js 20+"
    exit 1
fi

# 检查Java
if ! command -v java &> /dev/null; then
    echo "❌ 未找到 Java，请先安装 JDK 17+"
    exit 1
fi

echo "✅ 环境检查通过"

# 进入前端目录
cd frontend

# 安装依赖（如果需要）
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
fi

# 构建Web应用
echo "🔨 构建 Web 应用..."
npm run build

# 检查是否已初始化Capacitor
if [ ! -d "android" ]; then
    echo "🔧 初始化 Capacitor Android 项目..."
    npx cap add android
fi

# 同步到Android
echo "🔄 同步到 Android 项目..."
npx cap sync

# 复制资源
npx cap copy android

cd android

# 构建APK
if [ "$BUILD_TYPE" == "release" ]; then
    echo "📱 构建 Release APK..."
    ./gradlew assembleRelease
    APK_PATH="app/build/outputs/apk/release/app-release.apk"
else
    echo "📱 构建 Debug APK..."
    ./gradlew assembleDebug
    APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
fi

cd ..

echo ""
echo "✅ 构建完成！"
echo "📦 APK 位置: frontend/android/${APK_PATH}"
echo ""

# 显示APK信息
if [ -f "android/${APK_PATH}" ]; then
    APK_SIZE=$(du -h "android/${APK_PATH}" | cut -f1)
    echo "📊 APK 大小: ${APK_SIZE}"

    echo ""
    echo "🚀 安装到设备:"
    echo "   adb install android/${APK_PATH}"
    echo ""
    echo "📤 分享APK:"
    echo "   前往 frontend/android/${APK_PATH} 查看文件"
fi
