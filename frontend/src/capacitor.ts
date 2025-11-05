import { App } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';

// Capacitor 初始化
export async function initCapacitor() {
  try {
    // 配置状态栏
    await StatusBar.setStyle({ style: Style.Light });
    await StatusBar.setBackgroundColor({ color: '#16a34a' });

    // 隐藏启动画面
    await SplashScreen.hide();

    // 监听返回按钮
    App.addListener('backButton', ({ canGoBack }) => {
      if (!canGoBack) {
        App.exitApp();
      } else {
        window.history.back();
      }
    });

    console.log('Capacitor initialized');
  } catch (error) {
    console.error('Capacitor init error:', error);
  }
}

// 检查是否在原生应用中运行
export function isNativeApp(): boolean {
  return window.location.protocol === 'capacitor:' ||
         window.location.protocol === 'ionic:';
}

// 获取应用信息
export async function getAppInfo() {
  try {
    const info = await App.getInfo();
    return info;
  } catch (error) {
    console.error('Get app info error:', error);
    return null;
  }
}
