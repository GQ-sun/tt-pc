<template>
  <div class="container-image">
    <el-card>
      <div slot="header">
        <!-- 面包屑导航 -->
        <my-bread>素材管理</my-bread>
      </div>
      <div class="buttons">
        <!-- 按钮式单选框组 -->
        <el-radio-group v-model="reqParams.collect" size="small" @change="toggleList">
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
        <!-- 按钮 添加素材-->
        <el-button
          type="success"
          size="small"
          style="float:right"
          @click="dialogVisible = true"
        >添加素材</el-button>
        <!-- 图片列表 -->
        <div class="img_list">
          <!-- 每一个素材块 -->
          <div class="img_item" v-for="item in images" :key="item.id">
            <img :src="item.url" />
            <!-- 功能条 -->
            <div class="footer" v-if="!reqParams.collect">
              <span
                class="el-icon-star-off"
                :class="{red:item.is_collected}"
                @click="toggleCollect(item)"
              ></span>
              <span class="el-icon-delete" @click="del(item.id)"></span>
            </div>
          </div>
        </div>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="reqParams.per_page"
          :current-page="reqParams.page"
          @current-change="pager"
        ></el-pagination>
        <!-- 对话框 -->
        <el-dialog
          title="添加素材"
          :visible.sync="dialogVisible"
          width="300px"
          style="text-align:center"
        >
          <!-- 上传组件 -->
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      reqParams: {
        // false 全部  true 收藏
        collect: false,
        page: 1,
        per_page: 10
      },
      // 素材列表
      images: [],
      // 总条数
      total: 0,
      // 对话框是否显示
      dialogVisible: false
    }
  },
  created () {
    this.getImages()
  },
  methods: {
    // 分页功能
    pager (newPage) {
      this.reqParams.page = newPage
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
    // 切换全部收藏按钮
    toggleList () {
      this.reqParams.page = 1
      this.getImages()
    },
    // 收藏与取消收藏功能
    async toggleCollect (item) {
      const {
        data: { data }
      } = await this.$http.put(`user/images/${item.id}`, {
        // 判断本身的状态
        collect: !item.is_collected
      })
      item.is_collected = data.collect
      // 提示信息
      this.$message.success((data.collect ? '收藏' : '取消收藏') + '成功')
    },
    del (id) {
      // 温馨提示 弹框
      this.$confirm('此操作将永久删除该图片, 是否继续?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$http.delete(`user/images/${id}`)
        this.getImages()
        this.$message.success('删除成功')
      })
    }
  }
}
</script>

<style scoped lang='less'>
.img_list {
  padding-top: 20px;
  .img_item {
    border: 1px dashed #dddddd;
    width: 150px;
    height: 150px;
    position: relative;
    display: inline-block;
    margin-right: 50px;
    margin-bottom: 20px;
    img {
      width: 100%;
      height: 100%;
    }
    .footer {
      width: 100%;
      height: 30px;
      background-color: rgba(0, 0, 0, 0.5);
      position: absolute;
      bottom: 0;
      left: 0;
      text-align: center;
      line-height: 30px;
      color: white;
      span {
        margin: 0 20px;
        &.red {
          color: red;
        }
      }
    }
  }
}
</style>
