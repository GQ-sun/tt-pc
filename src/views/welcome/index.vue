<template>
  <div class="container-welcome">
    <img src="../../assets/welcome.jpg" alt />
  </div>
</template>

<script>
export default {
  // 测试
  created () {
    this.$http
      .get('http://ttapi.research.itcast.cn/mp/v1_0/articles')
      .then(res => {
        console.log(res.data)
      })
      .catch(() => {
        console.log('err')
      })
  }
}
</script>

<style scoped lang='less'>
img {
  display: block;
  margin: 0 auto;
}
</style>
