import VueRouter from 'vue-router'
import Vue from 'vue'

import Login from '@/views/login'
import Home from '@/views/home'
import Welcome from '@/views/welcome'
import NotFind from '@/views/404'
import Article from '@/views/article'
import Image from '@/views/image'
import local from '@/utils/local'
import Publish from '@/views/publish'
Vue.use(VueRouter)
const router = new VueRouter({
  routes: [{
    path: '/login',
    component: Login
  }, {
    path: '/',
    component: Home,
    children: [{ path: '/', component: Welcome }, { path: '/article', component: Article }, { path: '/image', component: Image }, { path: '/publish', component: Publish }]
  }, { path: '*', component: NotFind }]
})
router.beforeEach((to, from, next) => {
  const user = local.getUser()
  if (user && user.token) {
    next()
  } else {
    if (to.path === '/login') {
      next()
    } else {
      next('/login')
    }
  }
})
export default router
