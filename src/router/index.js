import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Dashboard from '@/views/Dashboard.vue'
import Display from '@/views/Display.vue'

const routes = [
  { path: '/', name: 'Login', component: Login },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/display', name: 'Display', component: Display },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router