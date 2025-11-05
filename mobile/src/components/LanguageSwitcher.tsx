import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  const languages = [
    { code: 'zh-CN', name: t('languages.zh-CN') },
    { code: 'en', name: t('languages.en') },
  ];

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('common.language')}</Text>
      <View style={styles.buttonContainer}>
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            onPress={() => handleLanguageChange(lang.code)}
            style={[
              styles.button,
              i18n.language === lang.code ? styles.activeButton : styles.inactiveButton,
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                i18n.language === lang.code
                  ? styles.activeButtonText
                  : styles.inactiveButtonText,
              ]}
            >
              {lang.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  activeButton: {
    backgroundColor: '#16a34a',
  },
  inactiveButton: {
    backgroundColor: '#f3f4f6',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activeButtonText: {
    color: '#fff',
  },
  inactiveButtonText: {
    color: '#6b7280',
  },
});

export default LanguageSwitcher;
