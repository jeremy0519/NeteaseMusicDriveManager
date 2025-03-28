import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'iconify-icon'
import axios from 'axios'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')

export const axios_instance = axios.create({
  baseURL: 'http://localhost:3000/',
  timeout: 1000,
  withCredentials: true,
})
