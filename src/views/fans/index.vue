<template>
  <div class="container-fans">
    <el-card>
      <div slot="header">
        <my-bread>粉丝管理</my-bread>
      </div>
      <!-- tab栏 -->
      <el-tabs v-model="activeName" type="card">
        <!-- 粉丝列表 -->
        <el-tab-pane label="粉丝列表" name="list">
          <div class="fanList">
            <div class="fanitem" v-for="item in fans" :key="item.id.toString()">
              <el-avatar :src="item.photo" :size="80"></el-avatar>
              <p>{{item.name}}</p>
              <el-button type="primary" plain size="small">+关注</el-button>
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
        <!-- 粉丝画像 -->
        <el-tab-pane label="粉丝画像" name="pic">
          <div ref="dom" style="width:600px;height:400px"></div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import defaultImg from '../../assets/avatar.jpg'
import echarts from 'echarts'
export default {
  data () {
    return {
      activeName: 'list',
      defaultImg,
      fans: [],
      reqParams: {
        page: 1,
        per_page: 24
      },
      total: 0
    }
  },
  created () {
    this.getFans()
  },
  methods: {
    // 获取粉丝列表
    async getFans () {
      const {
        data: { data }
      } = await this.$http.get('followers', { params: this.reqParams })
      this.fans = data.results
      this.total = data.total_count
    },
    // 分页功能
    pager (newpage) {
      this.reqParams.page = newpage
      this.getFans()
    }
  },
  mounted () {
    // 注意：获取dom需要在dom渲染完毕后
    const dom = this.$refs.dom
    const myEcharts = echarts.init(dom)
    // 配置及数据
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: {
        data: ['利润', '支出', '收入']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'value'
        }
      ],
      yAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        }
      ],
      series: [
        {
          name: '利润',
          type: 'bar',
          label: {
            normal: {
              show: true,
              position: 'inside'
            }
          },
          data: [200, 170, 240, 244, 200, 220, 210]
        },
        {
          name: '收入',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true
            }
          },
          data: [320, 302, 341, 374, 390, 450, 420]
        },
        {
          name: '支出',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'left'
            }
          },
          data: [-120, -132, -101, -134, -190, -230, -210]
        }
      ]
    }
    // 使用配置及数据
    myEcharts.setOption(option)
  }
}
</script>

<style scoped lang='less'>
.fanitem {
  width: 150px;
  height: 190px;
  text-align: center;
  border: 1px dashed #dddddd;
  padding-top: 20px;
  display: inline-block;
  margin-right: 20px;
  margin-bottom: 20px;
}
</style>
