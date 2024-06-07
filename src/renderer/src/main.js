
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import VueDragscroll from 'vue-dragscroll'
import i18n from "./i18n"



import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueDragscroll)
app.use(i18n)
app.component('VueDatePicker', VueDatePicker)

app.mount('#app')
