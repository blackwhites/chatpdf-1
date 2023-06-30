
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { resources } from './resources';

i18n
	// 检测用户语言
	// 操作文档: https://github.com/i18next/i18next-browser-languageDetector
	.use(LanguageDetector)
	// 将 i18n 实例传递给 react-i18next
	.use(initReactI18next)
	// 初始化 i18next
	// 所有配置选项: https://www.i18next.com/overview/configuration-options
	.init({
		resources,
		fallbackLng: "zh",
		debug: true,
		interpolation: {
			escapeValue: false, // not needed for react as it escapes by default
		},
    detection: {
      order: ['localStorage', 'sessionStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      lookupQuerystring: 'lng',
      lookupCookie: 'i18next',
      lookupLocalStorage: 'i18nextLng',
      lookupSessionStorage: 'i18nextLng',
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,
      caches: ['localStorage']
    }
	});

export default i18n;