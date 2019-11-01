<template>
  <el-select :value="value" @change="fn" placeholder="请选择" clearable>
    <el-option v-for="item in channelOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
  </el-select>
</template>

<script>
export default {
  props: ['value'],
  data () {
    return {
      //   value: null,
      channelOptions: []
    }
  },
  created () {
    this.getChannels()
  },
  methods: {
    async getChannels () {
      const {
        data: { data }
      } = await this.$http.get('channels')
      this.channelOptions = data.channels
    },
    // 子组件值变换触发的函数
    fn (channelId) {
      // 当频道id为空时，处理一下
      if (channelId === '') channelId = null
      this.$emit('input', channelId)
    }
  }
}
</script>

<style scoped lang='less'></style>
