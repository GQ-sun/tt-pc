import axios from 'axios'
import local from '@/utils/local'
import router from '@/router'
import JSONBIG from 'json-bigint'
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'

axios.defaults.transformResponse = [function (data) {
  // 对 data 进行任意转换处理
  // 对data进行格式转换  data就是后台响应的json字符串
  // 如果没数据呢？data === null 使用JSONBIG.parse(null) 报错
  try {
    return JSONBIG.parse(data)
  } catch (e) {
    return data
  }
}]

// 添加请求拦截器
axios.interceptors.request.use(config => {
  // 在发送请求之前做些什么
  const user = local.getUser() || {}// 代替判断有没有登录
  config.headers.Authorization = `Bearer ${user.token}`

  return config
}, (error) => {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(response => {
  // 对响应数据做点什么
  return response
}, (error) => {
  // 对响应错误做点什么  获取状态码  判断是不是401  如果是 跳转登录页面
  if (error.response.status === 401) {
    return router.push('/login')
  }
  return Promise.reject(error)
})
export default axios
