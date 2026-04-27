
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import VueDragscroll from 'vue-dragscroll'
import i18n from "./i18n"

import VuePlyr from 'vue-plyr'
import 'vue-plyr/dist/vue-plyr.css'

import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import './assets/main.css'
import '@/assets/styles/sovereign.css';

import Vue3ColorPicker from "vue3-colorpicker"
import "vue3-colorpicker/style.css"
import OpenLayersMap from "vue3-openlayers";
import "vue3-openlayers/dist/vue3-openlayers.css";

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueDragscroll)
app.use(i18n)
app.use(VuePlyr, {
    plyr: {}
  })
app.use(Vue3ColorPicker)
app.use(OpenLayersMap);
app.component('VueDatePicker', VueDatePicker)

app.mount('#app')
