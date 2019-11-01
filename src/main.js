import Vue from 'vue'
import App from './App.vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import router from '@/router'// 绝对路径

import axios from '@/api'
// import myBread from '@/components/my-bread'
// Vue.component('my-bread', myBread)
import plugin from '@/components'
// 组件css
import '@/styles/index.css'
Vue.use(plugin)
Vue.prototype.$http = axios

Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
