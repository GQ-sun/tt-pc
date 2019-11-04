<template>
  <div class="container-publish">
    <el-card>
      <div slot="header">
        <my-bread>{{$route.query.id?'修改':'发布'}}文章</my-bread>
      </div>
      <!-- 表单部分 -->
      <el-form label-width="100px" v-model="articleForm">
        <el-form-item label="标题：">
          <el-input style="width:400px" v-model="articleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="内容：">
          <!-- bidirectional data binding（双向数据绑定） -->
          <quill-editor v-model="articleForm.content" :options="editorOption"></quill-editor>
        </el-form-item>
        <el-form-item label="封面：">
          <el-radio-group v-model="articleForm.cover.type" @change="articleForm.cover.images = []">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <!-- 上传图组件 -->
          <!-- //单图 -->
          <div v-if="articleForm.cover.type===1">
            <my-image v-model="articleForm.cover.images[0]"></my-image>
          </div>
          <!-- 三图 -->
          <div v-if="articleForm.cover.type===3">
            <my-image v-for="i in 3" v-model="articleForm.cover.images[i-1]" :key="i"></my-image>
          </div>
        </el-form-item>
        <el-form-item label="频道：">
          <my-channel v-model="articleForm.channel_id"></my-channel>
        </el-form-item>
        <el-form-item v-if="$route.query.id">
          <el-button type="primary" @click="update(false)">修改</el-button>
          <el-button @click="update(true)">存入草稿</el-button>
        </el-form-item>
        <el-form-item v-else>
          <el-button type="primary" @click="creat(false)">发表</el-button>
          <el-button @click="creat(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
export default {
  data () {
    return {
      // 富文本编辑器的配置选项
      editorOption: {
        // 内容占位符
        placeholder: null,
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            ['image']
          ]
        }
      },
      articleForm: {
        title: null,
        cover: {
          type: 1,
          images: []
        },
        channel_id: null,
        content: null
      }
    }
  },
  components: {
    quillEditor
  },
  // 当路由规则没有发生改变的时候，组件是不会重新初始化
  // 只有组件初始化的时候才会只会执行一次。
  // 监听地址栏参数的变化，执行下面watch代码
  // created () {
  //   const articleId = this.$route.query.id
  //   if (articleId) {
  //     // 获取当前文章信息
  //     this.getArticle(articleId)
  //   }
  // },
  created () {
    this.toggleArticleStatus()
  },
  watch: {
    '$route.query.id': function () {
      this.toggleArticleStatus()
    }
  },
  methods: {
    // 发表保存文章
    async creat (draft) {
      await this.$http.post(`articles?draft=${draft}`, this.articleForm)
      // 提示
      this.$message.success(draft ? '保存草稿成功' : '发表成功')
      // 去内容管理
      this.$router.push('/article')
    },
    // 编辑保存文章
    async update (draft) {
      await this.$http.put(
        `articles/${this.articleForm.id}?draft=${draft}`,
        this.articleForm
      )
      // 提示
      this.$message.success(draft ? '保存草稿成功' : '修改成功')
      // 去内容管理
      this.$router.push('/article')
    },
    // 获取当前文章信息
    async getArticle (id) {
      const {
        data: { data }
      } = await this.$http.get(`articles/${id}`)
      this.articleForm = data
    },
    // 切换发表 修改状态
    toggleArticleStatus () {
      const articleId = this.$route.query.id
      if (articleId) {
        // 获取当前文章信息
        this.getArticle(articleId)
      } else {
        // 重置数据不能为空对象  模版中 articleForm.cover.images
        this.articleForm = {
          title: null,
          cover: {
            type: 1,
            images: []
          },
          channel_id: null,
          content: null
        }
      }
    }
  }
}
</script>

<style scoped lang='less'></style>
