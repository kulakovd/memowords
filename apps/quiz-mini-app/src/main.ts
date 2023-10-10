import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { createApi } from '@/api/apiClient'

const app = createApp(App)

app.use(createPinia())

const telegram = (window as unknown as { Telegram: { WebApp: TelegramWebApp } }).Telegram.WebApp

// provide the ApiClient and TelegramWebApp instances to the app, so they can be injected into stores and components.
app.provide('api', createApi().client)
app.provide('telegram', telegram)

telegram.expand()

app.mount('#app')
