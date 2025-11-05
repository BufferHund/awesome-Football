import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';

import zhCN from './locales/zh-CN.json';
import en from './locales/en.json';

const resources = {
  'zh-CN': {
    translation: zhCN,
  },
  en: {
    translation: en,
  },
};

// 获取存储的语言设置
const getStoredLanguage = async (): Promise<string> => {
  try {
    const storedLang = await AsyncStorage.getItem('language');
    return storedLang || Localization.locale.split('-')[0];
  } catch {
    return 'zh';
  }
};

// 初始化 i18n
const initI18n = async () => {
  const lng = await getStoredLanguage();

  await i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: lng === 'zh' ? 'zh-CN' : lng,
      fallbackLng: 'zh-CN',
      compatibilityJSON: 'v3', // React Native 需要
      interpolation: {
        escapeValue: false,
      },
    });

  // 监听语言变化，保存到 AsyncStorage
  i18n.on('languageChanged', async (lng) => {
    try {
      await AsyncStorage.setItem('language', lng);
    } catch (error) {
      console.error('Failed to save language preference:', error);
    }
  });
};

initI18n();

export default i18n;
