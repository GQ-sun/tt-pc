import myBread from '@/components/my-bread'
import myChannel from '@/components/my-channel'
export default {
  install (Vue) {
    Vue.component('my-bread', myBread)
    Vue.component('my-channel', myChannel)
  }
}
