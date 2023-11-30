import { createI18n } from "vue-i18n"

const messages = {
  en: {
    message: {
      home: 'Home',
      about: 'About',
      help: 'Help',
      language: 'Language',
      signin: 'Sign-in'
    }
  },
  es: {
    message: {
      home: 'hogar',
      about: 'acerca de',
      help: 'ayuda',
      language: 'Language',
      signin: 'Sign-in'
    }
  },
  zh: {
    message: {
      home: '家',
      about: '关于',
      help: '帮助',
      language: 'Language',
      signin: 'Sign-in'
    }
  },
  jp: {
    message: {
      home: '家',
      about: 'について',
      help: 'ヘルプ',
      language: 'Language',
      signin: 'Sign-in'
    }
  }
}

export default createI18n({
  locale: 'en', // <--- 1
  fallbackLocale: 'es', // <--- 2
  legacy: false, // <--- 3
  globalInjection: true, // <--- add this
  messages
})
