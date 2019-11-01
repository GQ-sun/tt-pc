<template>
  <div class="container-article">
    <!-- 筛选条件布局 -->
    <el-card>
      <!-- 面包屑导航 -->
      <div slot="header">
        <my-bread>内容管理</my-bread>
      </div>
      <!-- 表单内容 -->
      <el-form label-width="80px" size="small">
        <el-form-item label="状态：">
          <el-radio-group v-model="reqParams.status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">全待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道：">
          <!-- 频道组件 -->
          <my-channel v-model="reqParams.channel_id"></my-channel>
        </el-form-item>
        <el-form-item label="日期：">
          <el-date-picker
            v-model="dataArr"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changeDate"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 筛选结果布局 -->
    <el-card style="margin-top:20px">
      <div slot="header">
        <span>根据筛选条件共查询到 {{total}} 条结果</span>
      </div>
      <!-- 表格 -->
      <el-table :data="articles">
        <el-table-column label="封面">
          <!-- 自定义列 -->
          <template slot-scope="scope">
            <!-- 封面图 -->
            <el-image :src="scope.row.cover.images[0]" fit="fill" style="width:150px;height:100px">
              <div slot="error">
                <img src="../../assets/error.gif" alt idth="150" height="100" />
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="标题" prop="title"></el-table-column>
        <el-table-column label="状态">
          <!-- 自定义列 -->
          <template slot-scope="scope">
            <el-tag type="info" v-if="scope.row.status===0">草稿</el-tag>
            <el-tag v-if="scope.row.status===1">待审核</el-tag>
            <el-tag type="success" v-if="scope.row.status===2">审核通过</el-tag>
            <el-tag type="warning" v-if="scope.row.status===3">审核失败</el-tag>
            <el-tag type="danger" v-if="scope.row.status===4">已删除</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" prop="pubdate"></el-table-column>
        <el-table-column label="操作" width="120px">
          <!-- 自定义列表 -->
          <template slot-scope="scope">
            <el-button
              plain
              type="primary"
              icon="el-icon-edit"
              circle
              @click="toEdit(scope.row.id)"
            ></el-button>
            <el-button plain type="danger" icon="el-icon-delete" circle @click="del(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        style="margin-top:20px"
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="reqParams.perpage"
        :current-page="reqParams.page"
        @current-change="pager"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 筛选参数
      // 使用axios提交数据时候  如果数据的值为null是不会提交该字段
      reqParams: {
        status: null,
        channel_id: 4,
        begin_pubdate: null,
        end_pubdate: null,
        // 当前页码,每一页显示条数
        page: 1,
        perpage: 20
      },
      // 数据总数
      total: 0,
      // 频道选项数据
      channelOptions: [
        { value: 1, label: 'java' },
        { value: 2, label: '前端' }
      ],
      // 日期数组
      dataArr: [],
      // 文章表格
      articles: []
    }
  },
  created () {
    this.getArticles()
  },
  methods: {
    // 获取文章列表数据
    // 第一种： axios.get(url?key=value&key1=vaule1&...) get传参
    // 第二种： axios.get(url, {params:参数对象})
    async getArticles () {
      const {
        data: { data }
      } = await this.$http.get('articles', { params: this.reqParams })
      this.articles = data.results
      this.total = data.total_count
    },
    // 分页功能
    pager (newPage) {
      this.reqParams.page = newPage
      this.getArticles()
    },
    // 筛选功能
    search () {
      // 准备日期数据
      // 准备数据获取
      // 如果频道的值''的时候 修改为null
      if (this.reqParams.channel_id === '') {
        this.reqParams.channel_id = null
      }
      // 回到第一页
      console.log(this.reqParams.channel_id)
      this.reqParams.page = 1
      this.getArticles()
    },
    // 选择日期触发的事件
    changeDate (dateArr) {
      // 后端需要的是字符串
      // 注意:清除选择的日期后,dateArr值为null
      if (dateArr) {
        this.reqParams.begin_pubdate = dateArr[0]
        this.reqParams.end_pubdate = dateArr[1]
      } else {
        this.reqParams.begin_pubdate = null
        this.reqParams.end_pubdate = null
      }
    },
    // 编辑事件
    toEdit (id) {
      this.$router.push({ path: 'publish', query: 'id' })
    },
    // 删除
    async del (id) {
      await this.$http.delete(`articles/${id}`)
      // 提示删除成功
      this.$message.success('删除成功')
      // 更新列表
      this.getArticles()
    }
  }
}
</script>

<style scoped lang='less'></style>
