// Capacitor 初始化 - 兼容 Web 和原生环境
let App: any = null;
let SplashScreen: any = null;
let StatusBar: any = null;
let Style: any = null;

// 动态导入 Capacitor 模块，如果不存在则忽略
try {
  if (typeof window !== 'undefined') {
    // 检测是否在原生环境中
    const isNative = window.location.protocol === 'capacitor:' ||
                     window.location.protocol === 'ionic:';

    if (isNative) {
      // 只在原生环境中导入
      import('@capacitor/app').then(module => { App = module.App; });
      import('@capacitor/splash-screen').then(module => { SplashScreen = module.SplashScreen; });
      import('@capacitor/status-bar').then(module => {
        StatusBar = module.StatusBar;
        Style = module.Style;
      });
    }
  }
} catch (error) {
  console.log('Capacitor modules not available - running in web mode');
}

// Capacitor 初始化
export async function initCapacitor() {
  // 检查是否在原生应用中运行
  if (!isNativeApp()) {
    console.log('Running in web mode, Capacitor features disabled');
    return;
  }

  try {
    // 等待模块加载
    await new Promise(resolve => setTimeout(resolve, 100));

    if (StatusBar && Style) {
      // 配置状态栏
      await StatusBar.setStyle({ style: Style.Light }).catch(() => {});
      await StatusBar.setBackgroundColor({ color: '#16a34a' }).catch(() => {});
    }

    if (SplashScreen) {
      // 隐藏启动画面
      await SplashScreen.hide().catch(() => {});
    }

    if (App) {
      // 监听返回按钮
      App.addListener('backButton', ({ canGoBack }: any) => {
        if (!canGoBack) {
          App.exitApp();
        } else {
          window.history.back();
        }
      }).catch(() => {});
    }

    console.log('Capacitor initialized');
  } catch (error) {
    console.error('Capacitor init error:', error);
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
  if (!isNativeApp() || !App) {
    return null;
  }

  try {
    const info = await App.getInfo();
    return info;
  } catch (error) {
    console.error('Get app info error:', error);
    return null;
  }
}
