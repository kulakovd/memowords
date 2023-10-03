import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { createApi } from '@/api/apiClient'

const app = createApp(App)

app.use(createPinia())
app.provide('api', createApi().client)

app.mount('#app')
