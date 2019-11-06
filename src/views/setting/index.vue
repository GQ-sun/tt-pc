<template>
  <div class="container-setting">
    <el-card>
      <div slot="header">
        <my-bread>个人设置</my-bread>
      </div>
      <!-- 栅格布局 -->
      <el-col>
        <!-- //左边 -->
        <el-col :span="12">
          <!-- 表单 -->
          <el-form label-width="120px">
            <el-form-item label="编号：">{{userInfo.id}}</el-form-item>
            <el-form-item label="手机号：">{{userInfo.mobile}}</el-form-item>
            <el-form-item label="媒体名称：">
              <el-input v-model="userInfo.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍：">
              <el-input type="textarea" :rows="3" v-model="userInfo.intro"></el-input>
            </el-form-item>
            <el-form-item label="邮箱：">
              <el-input v-model="userInfo.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveInfo">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <!-- 右边 -->
        <el-col :span="12">
          <!-- 上传 -->
          <!-- 上传组件 -->
          <el-upload
            class="avatar-uploader"
            action
            :show-file-list="false"
            style="text-align:center"
            :http-request="updatePhoto"
          >
            <img v-if="userInfo.photo" :src="userInfo.photo" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <p style="text-align:center">修改头像</p>
        </el-col>
      </el-col>
    </el-card>
  </div>
</template>

<script>
import eventBus from '@/eventBus'
import local from '@/utils/local'
export default {
  data () {
    return {
      userInfo: {
        name: '',
        intro: '',
        email: '',
        photo: null
      }
    }
  },
  created () {
    this.getUserInfo()
  },
  methods: {
    // 获取用户信息
    async getUserInfo () {
      const {
        data: { data }
      } = await this.$http.get('user/profile')
      this.userInfo = data
    },
    // 保存设置
    async saveInfo () {
      const { name, intro, email } = this.userInfo
      await this.$http.patch('user/profile', {
        name,
        intro,
        email
      })
      // 提示
      this.$message.success('保存成功')
      // 传递给home组件用户名
      eventBus.$emit('updateName', name)
      // 改本地储存
      const user = local.getUser()
      user.name = name
      local.setUser(user)
    },
    // 修改头像
    async updatePhoto ({ file }) {
      // res.file 是你选择图片后的文件对象
      // 获取文件对象  文档没有记录
      const formData = new FormData()
      // 可以通过append()方法来追加数据
      formData.append('photo', file)
      // 发请求
      const {
        data: { data }
      } = await this.$http.patch('user/photo', formData)
      // 提示
      this.$message.success('修改头像成功')
      // 预览
      this.userInfo.photo = data.photo
      // 更新home组件
      eventBus.$emit('updatePhoto', data.photo)
      // 更新本地存储
      const user = local.getUser()
      user.photo = data.photo
      local.setUser(user)
    }
  }
}
</script>

<style scoped lang='less'></style>
