import { createI18n } from "vue-i18n"

const messages = {
  en: {
    nav: {
      home: "Home",
      about: "About"
    },
    home: {
      header: "Welcome to the Vue 3 I18n tutorial!",
      created_by: "This tutorial was brought to you by Lokalise."
    },
    about: {
      header: "About us"
    }
  },
  zh: {
    nav: {
      home: "家",
      about: "关于"
    },
    home: {
      header: "Welcome to the Vue 3 I18n tutorial!",
      created_by: "This tutorial was brought to you by Lokalise."
    },
    about: {
      header: "About us"
    }
  }
}
/*
{
  "message": "welcome",
  "hello": "howdy",
  "home": "home",
  "about": "about",
  "dashboard": "Dashboard",
  "data": "Data",
  "toolkit": "Toolkit",
  "welcome": "Welcome",
  "help": "Help"
}
*/