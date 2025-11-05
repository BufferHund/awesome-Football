// Capacitor 初始化 - Web 环境存根
// 在 Web 开发时，此文件提供空实现
// 在构建 Android 时，需要先安装 Capacitor 依赖

export async function initCapacitor() {
  // 在 Web 环境中不执行任何操作
  if (!isNativeApp()) {
    console.log('Running in web mode');
    return;
  }

  // 原生环境：动态加载 Capacitor 功能
  try {
    // @ts-ignore - 这些模块只在 Android 构建时存在
    const { App } = await import('@capacitor/app');
    // @ts-ignore
    const { SplashScreen } = await import('@capacitor/splash-screen');
    // @ts-ignore
    const { StatusBar, Style } = await import('@capacitor/status-bar');

    // 配置状态栏
    await StatusBar.setStyle({ style: Style.Light }).catch(() => {});
    await StatusBar.setBackgroundColor({ color: '#16a34a' }).catch(() => {});

    // 隐藏启动画面
    await SplashScreen.hide().catch(() => {});

    // 监听返回按钮
    App.addListener('backButton', ({ canGoBack }: any) => {
      if (!canGoBack) {
        App.exitApp();
      } else {
        window.history.back();
      }
    }).catch(() => {});

    console.log('Capacitor initialized');
  } catch (error) {
    console.log('Capacitor not available:', error);
  }
}

// 检查是否在原生应用中运行
export function isNativeApp(): boolean {
  if (typeof window === 'undefined') return false;
  return window.location.protocol === 'capacitor:' ||
         window.location.protocol === 'ionic:';
}

// 获取应用信息
export async function getAppInfo() {
  if (!isNativeApp()) {
    return null;
  }

  try {
    // @ts-ignore
    const { App } = await import('@capacitor/app');
    const info = await App.getInfo();
    return info;
  } catch (error) {
    console.error('Get app info error:', error);
    return null;
  }
}
