<template>
  <div class="my-image">
    <!-- 按钮 -->
    <div class="btn_box" @click="open">
      <img src="../assets/default.png" />
    </div>
    <!-- 对话框 -->
    <el-dialog :visible.sync="dialogVisible" width="700px">
      <!-- tab栏 -->
      <el-tabs v-model="activeName" type="card">
        <!-- 素材库 -->
        <el-tab-pane label="素材库" name="image">
          <!-- 按钮式单选框组 -->
          <el-radio-group v-model="reqParams.collect" size="small" @change="toggleList">
            <el-radio-button :label="false">全部</el-radio-button>
            <el-radio-button :label="true">收藏</el-radio-button>
          </el-radio-group>
          <!-- 素材列表 -->
          <div class="img_list">
            <!-- 每一个素材块 -->
            <div
              class="img_item"
              :class="{selected:selectedImgUrl===item.url}"
              @click="selectedImg(item.url)"
              v-for="item in images"
              :key="item.id"
            >
              <img :src="item.url" />
            </div>
          </div>
          <!-- 分页功能 -->
          <el-pagination
            v-if="total>reqParams.per_page"
            background
            layout="prev, pager, next"
            :total="total"
            :page-size="reqParams.per_page"
            :current-page="reqParams.page"
            @current-change="pager"
          ></el-pagination>
        </el-tab-pane>
        <!-- 上传图片 -->
        <el-tab-pane label="上传图片" name="upload">
          <!-- 上传组件 -->
          <el-upload
            class="avatar-uploader"
            action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
            :headers="headers"
            :show-file-list="false"
            :on-success="handleImg"
            name="image"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import local from '@/utils/local'
export default {
  data () {
    return {
      dialogVisible: false,
      activeName: 'image',
      reqParams: {
        // false 全部  true 收藏
        collect: false,
        page: 1,
        per_page: 8
      },
      // 素材数据
      images: [],
      // 总条数
      total: 0,
      // 被选中图片路径
      selectedImgUrl: null,
      // 请求头部
      headers: {
        Authorization: `Bearer ${local.getUser().token}`
      },
      // 预览图片地址
      imageUrl: ''
    }
  },
  methods: {
    //   对话框打开
    open () {
      this.dialogVisible = true
      // 加载素材列表
      this.getImages()
    },
    // 切换全部收藏按钮
    toggleList () {
      this.reqParams.page = 1
      this.getImages()
    },
    // 获取素材列表
    async getImages () {
      const {
        data: { data }
      } = await this.$http.get('user/images', { params: this.reqParams })
      this.images = data.results
      this.total = data.total_count
    },
    // 换页功能
    pager (newPage) {
      this.reqParams.page = newPage
      this.getImages()
    },
    // 选中功能
    selectedImg (url) {
      this.selectedImgUrl = url
    },
    // 添加素材请求成功处理函数
    handleImg (res) {
      this.imageUrl = res.data.url
      this.$message.success('上传成功')
      window.setTimeout(() => {
        // 自动关闭对话框,更新列表数据
        this.dialogVisible = false
        this.getImages()
        // 清空预览图
        this.imageUrl = null
      }, 2000)
    }
  }
}
</script>

<style scoped lang='less'>
.my-image {
  display: inline-block;
  margin-right: 20px;
}
.btn_box {
  width: 150px;
  height: 150px;
  border: 1px dashed #ddd;
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}
.dialog-footer {
  width: 100%;
  text-align: center;
  display: block;
}
//素材列表
.img_list {
  padding-top: 20px;
  .img_item {
    border: 1px dashed #dddddd;
    width: 140px;
    height: 120px;
    position: relative;
    display: inline-block;
    margin-right: 20px;
    margin-bottom: 20px;
    img {
      width: 100%;
      height: 100%;
    }
    &.selected::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5) url('../assets/selected.png') no-repeat
        center/ 50px;
    }
  }
}
//上传图片
.avatar-uploader {
  text-align: center;
}
</style>
