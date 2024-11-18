import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './en.json';
import sr from './sr.json';

const resources = {
  en: {translation: en},
  sr: {translation: sr},
};

i18next

  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    compatibilityJSON: 'v3',
    resources,
    fallbackLng: 'en',
    lng: 'en',// default language to use.
  });

export default i18next;