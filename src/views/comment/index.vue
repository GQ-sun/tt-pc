<template>
  <div class="container-comment">
    <el-card>
      <div slot="header">
        <my-bread>评论管理</my-bread>
        <!-- 表格 -->
        <el-table :data="articles">
          <el-table-column label="标题" width="400" prop="title"></el-table-column>
          <el-table-column label="总评论数" prop="total_comment_count"></el-table-column>
          <el-table-column label="粉丝评论数" prop="fans_comment_count"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">{{scope.row.comment_status?"正常":"关闭"}}</template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.comment_status"
                type="danger"
                size="small"
                @click="changeStatus(scope.row.id,false)"
              >关闭评论</el-button>
              <el-button
                v-else
                type="success"
                size="small"
                @click="changeStatus(scope.row.id,true)"
              >打开评论</el-button>
            </template>
          </el-table-column>
        </el-table>
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
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      articles: [],
      reqParams: {
        response_type: 'comment',
        page: 1,
        per_page: 20
      },
      total: 0
    }
  },
  created () {
    this.getArticles()
  },
  methods: {
    // 获取评论列表
    async getArticles () {
      const {
        data: { data }
      } = await this.$http.get('articles', { params: this.reqParams })
      //   渲染
      this.articles = data.results
      // 总条数
      this.total = data.total_count
    },
    // 分页功能
    pager (newPage) {
      this.reqParams.page = newPage
      this.getArticles()
    },
    // 改变评论状态
    changeStatus (id, status) {
      const text = status ? '您确定要打开评论吗' : '您确定要关闭评论吗'
      this.$confirm(text, '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const {
            data: { data }
          } = await this.$http.put(`comments/status?article_id=${id}`, {
            allow_comment: status
          })
          // 提示
          this.$message.success(
            data.allow_comment ? '打开评论成功' : '关闭评论成功'
          )
          // 更新列表
          this.getArticles()
        })

        .catch(() => {})
    }
  }
}
</script>

<style scoped lang='less'></style>
