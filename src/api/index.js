import axios from 'axios'
import local from '@/utils/local'
import router from '@/router'
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'

// 添加请求拦截器
axios.interceptors.request.use(config => {
  // 在发送请求之前做些什么
  const user = local.getUser() || {}// 代替判断有没有登录
  config.headers.Authorization = `Bearer ${user.token}`

  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(response => {
  // 对响应数据做点什么
  return response
}, function (error) {
  // 对响应错误做点什么  获取状态码  判断是不是401  如果是 跳转登录页面
  if (error.response.status === 401) {
    return router.push('/login')
  }
  return Promise.reject(error)
})
export default axios
